// /api/user/[id]/quizzes/[quizId]/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Quiz, Attempt } from '@/lib/models/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import mongoose from 'mongoose';

interface Params {
  id: string;
  quizId: string;
}

// Define a TypeScript type for Quiz
interface QuizType {
  _id: string;
  createdBy: mongoose.Types.ObjectId;
  prompt: string;
  createdAt: Date;
  questions: Array<object>;
  subject: string;
  difficulty: string;
  timerDuration: number;
  averageRating: number;
  ratingCount: number;
  attemptCount: number;
  public: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id, quizId } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    console.error("Unauthorized access attempt. Session:", session, "Params ID:", id);
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    // Explicitly cast the result to a known type
    const quiz = await Quiz.findById(quizId).lean().exec() as QuizType | null;

    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz non trouvé.' },
        { status: 404 }
      );
    }

    // Convert createdBy to string for comparison
    if (quiz.createdBy.toString() !== id) {
      console.error("User not authorized to access this quiz. Quiz CreatedBy:", quiz.createdBy, "User ID:", id);
      return NextResponse.json(
        { message: 'Non autorisé.' },
        { status: 401 }
      );
    }

    // Fetch statistics
    const totalAttempts = await Attempt.countDocuments({ quiz: quizId });
    const totalUsers = await Attempt.distinct('user', { quiz: quizId }).then((users) => users.length);

    return NextResponse.json(
      {
        quiz: {
          id: quiz._id.toString(),
          prompt: quiz.prompt,
          createdAt: quiz.createdAt,
          questionsCount: quiz.questions.length,
          subject: quiz.subject,
          difficulty: quiz.difficulty,
          timerDuration: quiz.timerDuration,
          averageRating: quiz.averageRating,
          ratingCount: quiz.ratingCount,
          attemptCount: quiz.attemptCount,
          public: quiz.public,
        },
        statistics: {
          totalAttempts,
          totalUsers,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des détails du quiz.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id, quizId } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const updateFields = body;

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: quizId, createdBy: id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedQuiz) {
      return NextResponse.json(
        { message: 'Quiz non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quiz: updatedQuiz }, { status: 200 });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du quiz.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id, quizId } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return NextResponse.json(
        { message: 'Quiz non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Quiz supprimé avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du quiz.' },
      { status: 500 }
    );
  }
}

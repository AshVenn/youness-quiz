//api/user/[id]/quizzes/route.ts


import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Quiz, Subject } from '@/lib/models/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const quizzes = await Quiz.find({ createdBy: id }).sort({ createdAt: -1 });
    const subjects = await Subject.find({ createdBy: id });

    const quizzesData = quizzes.map((quiz) => ({
      id: quiz._id.toString(),
      prompt: quiz.prompt,
      createdAt: quiz.createdAt,
      questionsCount: quiz.questions.length,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      timerDuration: quiz.timerDuration,
    }));

    return NextResponse.json({ quizzes: quizzesData, subjects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des quiz.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      {message: 'Non autorisé.'},
      {status: 401}
    );
  }

  try {
    const { quizId, newSubject } = await request.json();

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { subject: newSubject },
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

  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const { quizId } = await request.json();

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
// File: src/app/api/user/[id]/dashboard/route.ts

import { NextResponse } from 'next/server';
import { User, Quiz } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect(); // Connect to the database

  const { id } = params; // Get the user ID from the request params

  // Get the session
  const session = await getServerSession(authOptions);

  // Ensure the user is authenticated and is accessing their own dashboard
  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    // Find the user by ID
    const user = await User.findById(id).exec();
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Fetch the quizzes created by the user
    const quizzes = await Quiz.find({ createdBy: user._id }).sort({ createdAt: -1 }).exec();

    // Calculate total quizzes
    const totalQuizzes = quizzes.length;

    // Calculate best score (assuming you have scores stored somewhere)
    // For this example, we'll assume quizzes have a 'bestScore' field
    const bestScore = quizzes.reduce((max, quiz) => {
      return quiz.bestScore && quiz.bestScore > max ? quiz.bestScore : max;
    }, 0);

    // Get the last quiz creation date
    const lastQuizDate = quizzes.length > 0 ? quizzes[0].createdAt : null;

    // Prepare quiz history data
    const quizHistory = quizzes.map((quiz) => ({
      quizId: quiz._id.toString(),
      title: quiz.prompt,
      createdAt: quiz.createdAt,
      questionsCount: quiz.questions.length,
      // Include other relevant data as needed
    }));

    // Respond with the dashboard data
    return NextResponse.json(
      {
        totalQuizzes,
        bestScore,
        lastQuizDate,
        quizHistory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors de la récupération du tableau de bord.' }, { status: 500 });
  }
}

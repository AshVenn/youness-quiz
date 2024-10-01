import { NextResponse } from 'next/server';
import { User, Quiz, Attempt } from '@/lib/models/models';
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

    // Fetch all attempts by the user
    const attempts = await Attempt.find({ user: user._id }).sort({ createdAt: -1 }).exec();

    // Calculate best score
    const bestScore = attempts.reduce((max, attempt) => {
      return attempt.score > max ? attempt.score : max;
    }, 0);

    // Get the last quiz creation date
    const lastQuizDate = quizzes.length > 0 ? quizzes[0].createdAt : null;

    // Prepare quiz history data
    const quizHistory = quizzes.map((quiz) => ({
      quizId: quiz._id.toString(),
      title: quiz.prompt,
      createdAt: quiz.createdAt,
      questionsCount: quiz.questions.length,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
    }));

    // Get unique subjects
    const subjects = Array.from(new Set(quizzes.map(quiz => quiz.subject)));

    // Calculate statistics for each difficulty level
    const difficultyStats = ['easy', 'medium', 'hard'].reduce((acc, difficulty) => {
      const difficultyAttempts = attempts.filter(attempt => 
        quizzes.find(quiz => quiz._id.toString() === attempt.quiz.toString())?.difficulty === difficulty
      );
      const totalScore = difficultyAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
      const averageScore = difficultyAttempts.length > 0 ? totalScore / difficultyAttempts.length : 0;
      
      acc[difficulty] = {
        totalAttempts: difficultyAttempts.length,
        averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
      };
      return acc;
    }, {} as Record<string, { totalAttempts: number; averageScore: number }>);

    // Respond with the dashboard data
    return NextResponse.json(
      {
        totalQuizzes,
        bestScore,
        lastQuizDate,
        quizHistory,
        subjects,
        difficultyStats,
        remainingAttempts: user.remainingAttempts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors de la récupération du tableau de bord.' }, { status: 500 });
  }
}
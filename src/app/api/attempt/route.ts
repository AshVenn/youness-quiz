import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db/db';
import { Attempt } from '@/lib/models/models'; // Ensure the Attempt model is properly defined
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

interface AttemptRequestBody {
  quizId: string;
  answers: (number | null)[]; // Accept either numbers or nulls for unanswered questions
  score: number;
  timeTaken?: number; // Optional
}

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    // Parse the request body and validate the structure
    const { quizId, answers, score, timeTaken }: AttemptRequestBody = await request.json();

    // Ensure answers array contains null for any unanswered questions
    const processedAnswers = answers.map(answer => (answer === undefined ? null : answer));

    // Find the number of previous attempts by the user for the same quiz
    const previousAttemptsCount = await Attempt.countDocuments({
      user: new mongoose.Types.ObjectId(session.user.id),
      quiz: new mongoose.Types.ObjectId(quizId),
    });

    // Set the attemptNumber dynamically based on previous attempts
    const attemptNumber = previousAttemptsCount + 1;

    // Save the new attempt to the database
    const attempt = new Attempt({
      user: new mongoose.Types.ObjectId(session.user.id), // Ensure correct ObjectId type
      quiz: new mongoose.Types.ObjectId(quizId),
      answers: processedAnswers,
      score,
      attemptNumber, // Set dynamically based on previous attempts
      timeTaken,
      createdAt: new Date(),
    });

    await attempt.save();

    return NextResponse.json(
      { message: 'Tentative enregistrée avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving attempt:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'enregistrement de la tentative.' },
      { status: 500 }
    );
  }
}

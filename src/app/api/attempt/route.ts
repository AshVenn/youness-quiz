// /app/api/attempt/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Attempt, Quiz, User } from '@/lib/models/models';
import { getToken } from 'next-auth/jwt';

export async function POST(request: Request) {
  await dbConnect();

  const { quizId, answers, score, timeTaken } = await request.json();

  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json({ message: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
  }

  try {
    const user = await User.findById(token.id);

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé.' }, { status: 404 });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz non trouvé.' }, { status: 404 });
    }

    // Incrémenter le nombre de tentatives
    quiz.attemptCount += 1;
    await quiz.save();

    // Créer la nouvelle tentative
    const attemptNumber = await Attempt.countDocuments({ user: user._id, quiz: quiz._id }) + 1;

    const newAttempt = new Attempt({
      user: user._id,
      quiz: quiz._id,
      answers,
      score,
      attemptNumber,
      timeTaken,
    });

    await newAttempt.save();

    return NextResponse.json({ message: 'Tentative enregistrée avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error saving attempt:', error);
    return NextResponse.json({ message: 'Erreur lors de l\'enregistrement de la tentative.' }, { status: 500 });
  }
}

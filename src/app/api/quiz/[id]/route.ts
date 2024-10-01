// File: src/app/api/quiz/[id]/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Quiz, Subject } from '@/lib/models/models';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const { id } = params;

  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz non trouvé.' }, { status: 404 });
    }

    // Return the quiz data
    return NextResponse.json(
      {
        prompt: quiz.prompt,
        questions: quiz.questions,
        difficulty: quiz.difficulty,
        subject:quiz.subject,
        timerEnabled: quiz.timerEnabled,
        timerDuration: quiz.timerDuration,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du quiz.' },
      { status: 500 }
    );
  }
}

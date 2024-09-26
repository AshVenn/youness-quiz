// File: src/app/api/user/[id]/quizzes/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Quiz } from '@/lib/models/models';

// Type definition for context.params
interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;

  try {
    // Fetch quizzes created by the user
    const quizzes = await Quiz.find({ createdBy: id }).sort({ createdAt: -1 });

    // Map the quizzes to the format expected by the frontend
    const quizzesData = quizzes.map((quiz) => ({
      id: quiz._id.toString(),
      prompt: quiz.prompt,
      createdAt: quiz.createdAt,
      questionsCount: quiz.questions.length,
    }));

    return NextResponse.json({ quizzes: quizzesData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des quiz.' },
      { status: 500 }
    );
  }
}

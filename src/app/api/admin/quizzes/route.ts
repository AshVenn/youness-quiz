// app/api/admin/quizzes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Quiz } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

export async function GET() {
  await dbConnect();
  try {
    const quizzes = await Quiz.find({}).populate('subject').populate('createdBy');
    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const data = await request.json();
    const newQuiz = new Quiz(data);
    await newQuiz.save();
    return NextResponse.json(newQuiz);
  } catch (error) {
    return NextResponse.error();
  }
}

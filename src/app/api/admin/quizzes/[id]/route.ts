// app/api/admin/quizzes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Quiz } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const quiz = await Quiz.findById(params.id).populate('subject').populate('createdBy');
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const data = await request.json();
    const quiz = await Quiz.findByIdAndUpdate(params.id, data, { new: true });
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const quiz = await Quiz.findByIdAndDelete(params.id);
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    return NextResponse.error();
  }
}

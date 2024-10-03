// app/api/admin/stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { User, Quiz, Attempt } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

export async function GET() {
  await dbConnect();
  try {
    const activeUsers = await User.countDocuments();
    const quizzesCreated = await Quiz.countDocuments();
    const totalAttempts = await Attempt.countDocuments();

    return NextResponse.json({
      activeUsers,
      quizzesCreated,
      totalAttempts,
    });
  } catch (error) {
    return NextResponse.error();
  }
}

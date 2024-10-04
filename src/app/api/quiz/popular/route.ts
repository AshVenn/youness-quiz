// /app/api/quizzes/popular/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Quiz } from '@/lib/models/models';

export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);

  const pageParam = searchParams.get('page') || '1';
  const limitParam = searchParams.get('limit') || '6';

  const page = parseInt(pageParam, 10);
  const limit = parseInt(limitParam, 10);
  const skip = (page - 1) * limit;

  try {
    const totalQuizzes = await Quiz.countDocuments({ public: true });

    const quizzes = await Quiz.find({ public: true })
      .sort({ attemptCount: -1 })
      .skip(skip)
      .limit(limit)
      .select('_id title createdBy difficulty featured attemptCount averageRating ratingCount')
      .populate('createdBy', 'username')
      .lean();

    return NextResponse.json({
      totalQuizzes,
      quizzes,
      totalPages: Math.ceil(totalQuizzes / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz populaires :', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération des quiz populaires' }, { status: 500 });
  }
}

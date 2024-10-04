// /app/api/categories/full/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Category } from '@/lib/models/models';

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const categories = await Category.find()
      .populate({
        path: 'subjects',
        populate: {
          path: 'quizzes',
          match: { public: true },
          select: '_id title createdBy difficulty featured averageRating ratingCount',
          populate: {
            path: 'createdBy',
            select: 'username',
          },
        },
      })
      .lean();


    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération des catégories' }, { status: 500 });
  }
}

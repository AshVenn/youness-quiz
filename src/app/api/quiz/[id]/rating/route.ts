import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Quiz } from '@/lib/models/models';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';

// Define types directly here
type RatingType = {
  user: mongoose.Types.ObjectId;
  rating: number;
};

type QuizType = {
  _id: string;
  ratings: RatingType[];
  averageRating: number;
  ratingCount: number;
  
};

export async function GET(request: NextRequest, { params }: { params: { quizId: string } }) {
  await dbConnect();

  const { quizId } = params;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  try {
    const quiz = (await Quiz.findById(quizId).lean()) as QuizType | null;

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz non trouvé.' }, { status: 404 });
    }

    let userHasRated = false;

    if (token && token.id && quiz.ratings) {
      userHasRated = quiz.ratings.some((rating) => rating.user.toString() === token.id);
    }

    return NextResponse.json({ userHasRated }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz rating:', error);
    return NextResponse.json({ message: "Erreur lors de la récupération de l'évaluation du quiz." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const quizId = params.id;
  const { rating }: { rating: number } = await request.json();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json({ message: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
  }

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ message: 'Évaluation invalide.' }, { status: 400 });
  }

  try {
    const quiz = (await Quiz.findById(quizId)) as QuizType | null;
    

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz non trouvé.' }, { status: 404 });
    }

    // Vérifier si l'utilisateur a déjà évalué le quiz
    const existingRating = quiz.ratings.find((r) => r.user.toString() === token.id);

    if (existingRating) {
      return NextResponse.json({ message: 'Vous avez déjà évalué ce quiz.',hasRated:true }, { status: 400 });
    }

    // Ajouter la nouvelle évaluation
    quiz.ratings.push({ user: new mongoose.Types.ObjectId(token.id), rating });

    // Recalculer la note moyenne et le nombre d'évaluations
    quiz.ratingCount = quiz.ratings.length;
    quiz.averageRating = quiz.ratings.reduce((acc, r) => acc + r.rating, 0) / quiz.ratingCount;

    await Quiz.updateOne({ _id: quizId }, { ratings: quiz.ratings, ratingCount: quiz.ratingCount, averageRating: quiz.averageRating });

    return NextResponse.json({ message: 'Évaluation enregistrée.' }, { status: 200 });
  } catch (error) {
    console.error('Error saving quiz rating:', error);
    return NextResponse.json({ message: "Erreur lors de l'enregistrement de l'évaluation." }, { status: 500 });
  }
}

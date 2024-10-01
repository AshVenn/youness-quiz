//api/user/[id]/quizzes/[quizId]/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Quiz } from '@/lib/models/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

interface Params {
  id: string;
  quizId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id, quizId } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return NextResponse.json(
        { message: 'Quiz non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Quiz supprimé avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du quiz.' },
      { status: 500 }
    );
  }
}

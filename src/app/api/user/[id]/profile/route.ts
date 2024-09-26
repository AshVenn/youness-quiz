// File: src/app/api/user/[id]/profile/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { User, Quiz } from '@/lib/models/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;

  // Get the session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and is requesting their own profile
  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    // Fetch user data
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé.' }, { status: 404 });
    }

    // Fetch quizzes created by the user
    const quizzes = await Quiz.find({ createdBy: id });

    // Calculate quiz count and average score if applicable
    const quizCount = quizzes.length;

    // For this example, let's assume you store user scores somewhere
    // Since it's not specified, we'll set averageScore to 0
    const averageScore = 0; // Replace with actual calculation if available

    // Construct the profile data
    const profileData = {
      name: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      quizCount,
      averageScore,
    };

    return NextResponse.json({ profile: profileData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du profil.' },
      { status: 500 }
    );
  }
}

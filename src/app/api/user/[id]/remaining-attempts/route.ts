// src/app/api/user/[id]/remaining-attempts/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { User } from '@/lib/models/models';
import type { NextRequest } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ message: 'Non autorisé.' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: 'ID utilisateur invalide.' }, { status: 400 });
  }

  try {
    const user = await User.findById(params.id).exec();
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé.' }, { status: 404 });
    }

    return NextResponse.json({ remainingAttempts: user.remainingAttempts }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des tentatives restantes:', error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}

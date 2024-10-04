// /app/api/admin/categories/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import { getToken } from 'next-auth/jwt';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  await dbConnect();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Vérifier si l'utilisateur est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  try {
    const category = await Category.findById(params.id).populate('subjects');
    if (!category) return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  await dbConnect();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Vérifier si l'utilisateur est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const category = await Category.findByIdAndUpdate(params.id, data, { new: true });
    if (!category) return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 });
    return NextResponse.json({ message: 'Catégorie mise à jour avec succès', category });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await dbConnect();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Vérifier si l'utilisateur est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  try {
    const category = await Category.findByIdAndDelete(params.id);
    if (!category) return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 });
    return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

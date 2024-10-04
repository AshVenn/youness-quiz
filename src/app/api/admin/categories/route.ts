// /app/api/admin/categories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  await dbConnect();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Vérifier si l'utilisateur est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  try {
    const categories = await Category.find({}).populate('subjects');
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Vérifier si l'utilisateur est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { name, featured } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Le nom de la catégorie est requis' }, { status: 400 });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ message: 'Cette catégorie existe déjà' }, { status: 400 });
    }

    const newCategory = new Category({
      name,
      createdBy: token.id,
      featured: featured || false,
    });

    await newCategory.save();

    return NextResponse.json({ message: 'Catégorie créée avec succès', category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

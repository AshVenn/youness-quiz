// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import bcrypt from 'bcryptjs'
import { getToken } from 'next-auth/jwt'

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  await dbConnect()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Vérifier si l'utilisateur est authentifié et est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { username, firstName, lastName, email, password, role } = await request.json()

    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'Tous les champs sont requis' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'Utilisateur déjà existant' }, { status: 400 })
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Créer le nouvel utilisateur
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      passwordHash,
      role: role || 'user',
    })

    await newUser.save()

    return NextResponse.json({ message: 'Utilisateur créé avec succès' }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}


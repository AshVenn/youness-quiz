// /api/admin/users/[id]/password/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db/db'
import { User } from '@/lib/models/models'
import bcrypt from 'bcryptjs'
import { getToken } from 'next-auth/jwt'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Vérifier si l'utilisateur est authentifié et est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = params
    const { newPassword } = await request.json()

    if (!newPassword) {
      return NextResponse.json({ message: 'Le nouveau mot de passe est requis' }, { status: 400 })
    }

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10)
    user.passwordHash = await bcrypt.hash(newPassword, salt)

    await user.save()

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès' }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe :', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

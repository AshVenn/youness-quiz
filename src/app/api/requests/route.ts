
// /api/requests/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db/db'
import { Request as UserRequest } from '@/lib/models/models'
import { getToken } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
  await dbConnect()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Vérifier si l'utilisateur est authentifié
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { type, message } = await request.json()

    if (!type || !message) {
      return NextResponse.json(
        { message: 'Le type et le message sont requis' },
        { status: 400 }
      )
    }

    const userId = token.id

    const newRequest = new UserRequest({
      user: userId,
      type,
      message,
    })

    await newRequest.save()

    return NextResponse.json(
      { message: 'Demande créée avec succès' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de la demande :', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

// /api/admin/requests/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db/db'
import { Request as UserRequest } from '@/lib/models/models'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  await dbConnect()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Vérifier si l'utilisateur est authentifié et est un administrateur
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const requests = await UserRequest.find().populate('user', 'username email')
    return NextResponse.json(requests, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes :', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

// /api/admin/requests/[id]/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db/db'
import { Request as UserRequest } from '@/lib/models/models'
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
    const { status } = await request.json()

    if (!status || !['open', 'closed'].includes(status)) {
      return NextResponse.json(
        { message: 'Le statut est requis et doit être "open" ou "closed"' },
        { status: 400 }
      )
    }

    const userRequest = await UserRequest.findById(id)
    if (!userRequest) {
      return NextResponse.json({ message: 'Demande non trouvée' }, { status: 404 })
    }

    userRequest.status = status
    await userRequest.save()

    return NextResponse.json(
      { message: 'Demande mise à jour avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande :', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

// /api/admin/quizzes/[id]/feature/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db/db'
import { Quiz } from '@/lib/models/models'
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
    const { featured } = await request.json()

    if (typeof featured !== 'boolean') {
      return NextResponse.json(
        { message: 'Le champ "featured" est requis et doit être un booléen' },
        { status: 400 }
      )
    }

    const quiz = await Quiz.findById(id)
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz non trouvé' }, { status: 404 })
    }

    quiz.featured = featured
    await quiz.save()

    return NextResponse.json({ message: 'Quiz mis à jour avec succès' }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du quiz :', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

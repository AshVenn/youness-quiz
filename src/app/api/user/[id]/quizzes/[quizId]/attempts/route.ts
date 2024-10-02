import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db/db'
import { Attempt } from '@/lib/models/models'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'

export async function GET(
  request: Request,
  { params }: { params: { id: string; quizId: string } }
) {
  await dbConnect()

  const { id, quizId } = params
  const session = await getServerSession(authOptions)

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.'  },
      { status: 401 }
    )
  }

  try {
    const attempts = await Attempt.find({ user: id, quiz: quizId })
      .sort({ createdAt: -1 })
      .select('score attemptNumber createdAt timeTaken')

    return NextResponse.json({ attempts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching attempts:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des tentatives.' },
      { status: 500 }
    )
  }
}
// /api/requests/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db/db'
import { Request as UserRequest } from '@/lib/models/models'
import { getToken } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
  await dbConnect()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Check if the user is authenticated
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })  // English error message
  }

  try {
    const { type, message } = await request.json()

    if (!type || !message) {
      return NextResponse.json(
        { message: 'Type and message are required' },  // English error message
        { status: 400 }
      )
    }

    const userId = token.id

    const newRequest = new UserRequest({
      user: userId,
      type,
      message,
      status: 'Pending'  // Status in English
    })

    await newRequest.save()

    return NextResponse.json(
      { message: 'Request successfully created' },  // English success message
      { status: 201 }
    )
  } catch (error) {
    console.error('Error while creating the request:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })  // English error message
  }
}

export async function GET(request: NextRequest) {
  await dbConnect()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Check if the user is authenticated
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })  // English error message
  }

  try {
    const userId = token.id
    const userRequests = await UserRequest.find({ user: userId }).sort({ createdAt: -1 })

    return NextResponse.json(userRequests, { status: 200 })
  } catch (error) {
    console.error('Error while retrieving the requests:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })  // English error message
  }
}

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

  // Check if the user is authenticated and is an administrator
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const { status } = await request.json()

    if (!status || !['Open', 'Closed', 'Resolved', 'Rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Status is required and must be "open", "closed", "resolved", or "rejected"' },
        { status: 400 }
      )
    }

    const userRequest = await UserRequest.findById(id)
    if (!userRequest) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    userRequest.status = status
    await userRequest.save()

    return NextResponse.json(
      { message: 'Request successfully updated' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

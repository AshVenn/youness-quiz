// app/api/admin/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const data = await request.json();
    const user = await User.findByIdAndUpdate(params.id, data, { new: true });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const user = await User.findByIdAndDelete(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.error();
  }
}

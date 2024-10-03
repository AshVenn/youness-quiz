// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

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
  await dbConnect();
  try {
    const data = await request.json();
    const { username, firstName, lastName, email, role } = data;
    const newUser = new User({ username, firstName, lastName, email, role });
    await newUser.save();
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.error();
  }
}

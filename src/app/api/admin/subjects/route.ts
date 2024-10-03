// app/api/admin/subjects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Subject } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

export async function GET() {
  await dbConnect();
  try {
    const subjects = await Subject.find({});
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const data = await request.json();
    const newSubject = new Subject(data);
    await newSubject.save();
    return NextResponse.json(newSubject);
  } catch (error) {
    return NextResponse.error();
  }
}

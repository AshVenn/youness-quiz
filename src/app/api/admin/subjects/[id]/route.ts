// app/api/admin/subjects/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Subject } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const subject = await Subject.findById(params.id);
    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    return NextResponse.json(subject);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const data = await request.json();

    
    if (data.category === undefined) {
      delete data.category; 
    }

    const subject = await Subject.findByIdAndUpdate(params.id, data, { new: true });
    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: Params) {
  await dbConnect();
  try {
    const subject = await Subject.findByIdAndDelete(params.id);
    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    return NextResponse.error();
  }
}

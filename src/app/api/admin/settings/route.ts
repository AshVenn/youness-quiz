// app/api/admin/settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Settings } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';

export async function GET() {
  await dbConnect();
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest) {
  await dbConnect();
  try {
    const data = await request.json();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings(data);
    } else {
      Object.assign(settings, data);
    }
    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.error();
  }
}

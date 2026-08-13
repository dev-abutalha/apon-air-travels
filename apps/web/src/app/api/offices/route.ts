import { NextResponse } from 'next/server';
import { connectDB, Office } from '@apon-air/database';

export async function GET() {
  try {
    await connectDB();
    const offices = await Office.find({ published: true }).sort({ isHeadOffice: -1 }).lean();
    return NextResponse.json({ success: true, data: offices });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch offices' }, { status: 500 });
  }
}

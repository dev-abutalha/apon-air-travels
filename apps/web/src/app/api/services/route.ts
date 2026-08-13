import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { Service } from '@apon-air/database';

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ published: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

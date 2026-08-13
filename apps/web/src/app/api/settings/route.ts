import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { SiteSettings } from '@apon-air/database';

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

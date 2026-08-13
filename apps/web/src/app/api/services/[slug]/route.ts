import { NextResponse } from 'next/server';
import { connectDB, Service } from '@apon-air/database';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const service = await Service.findOne({ slug, published: true }).lean();
    if (!service) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: service });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch service' }, { status: 500 });
  }
}

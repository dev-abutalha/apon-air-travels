import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { FAQ } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
  return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const faq = await FAQ.create(data);
  return NextResponse.json(faq, { status: 201 });
}

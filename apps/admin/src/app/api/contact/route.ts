import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Contact } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const messages = await Contact.find().sort({ createdAt: -1 });
  return NextResponse.json(messages);
}

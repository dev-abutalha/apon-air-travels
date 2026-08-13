import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { BlogPost } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const posts = await BlogPost.find().sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const post = await BlogPost.create(data);
  return NextResponse.json(post, { status: 201 });
}

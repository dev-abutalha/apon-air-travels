import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@apon-air/database';
import { hashPassword } from '@apon-air/auth';

export async function GET() {
  await connectDB();
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'editor',
      active: true,
    });
    return NextResponse.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role, active: user.active } }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

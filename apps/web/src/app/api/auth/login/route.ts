import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { User } from '@apon-air/database';
import { verifyPassword } from '@apon-air/auth';
import { signToken } from '@apon-air/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email, active: true });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, data: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}

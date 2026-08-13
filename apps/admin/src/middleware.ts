import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'session';
const LOGIN_URL = '/login';
const DASHBOARD_URL = '/dashboard';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginRoute = pathname.startsWith('/login');
  const isApiRoute = pathname.startsWith('/api');

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
  }

  if (isDashboardRoute && !token) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isApiRoute && !token && !pathname.startsWith('/api/auth/login')) {
    if (pathname.startsWith('/api/auth')) return NextResponse.next();
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/api/:path*'],
};

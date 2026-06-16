import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/authConstants';
import { getExpectedTokenEdge } from '@/lib/auth-edge';

// Protege todo el sitio (página + API de jobs) con una contraseña compartida.
// Permite sin auth: /login, /api/login y los assets de Next.

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname === '/login' ||
    pathname === '/api/login' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const expected = await getExpectedTokenEdge(process.env.APP_PASSWORD);
  const cookie   = request.cookies.get(AUTH_COOKIE)?.value;
  const authed   = expected && cookie === expected;

  if (!authed) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

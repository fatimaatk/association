import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isLoggedIn = !!token;

  const { pathname } = request.nextUrl;

  const publicPagesForGuests = ['/inscription', '/connexion'];

  // Si connecté, empêcher l'accès à /inscription et /connexion
  if (isLoggedIn && publicPagesForGuests.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/inscription', '/connexion'], // <== Ajoute /connexion ici aussi
};

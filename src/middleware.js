'use strict';

import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  const isRootRoute = request.nextUrl.pathname === '/';

  // Si es una ruta pública o API de autenticación, permitir acceso
  if (isAuthRoute || isApiAuthRoute || isRootRoute) {
    return NextResponse.next();
  }

  // Si no hay token y no es una ruta pública, redirigir al login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token, permitir acceso
  return NextResponse.next();
}

// Configurar rutas a las que se aplica este middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

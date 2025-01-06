// middleware.js
import { NextResponse, type NextRequest } from 'next/server';
import { hasCookie } from 'cookies-next';
import { USER_DATA, routes, protectedRoutes, unProtectedRoutes } from '@/app/base/utils/constants';

export const dynamic = 'force-dynamic';

export const config = {
  matcher: routes,
};

export function middleware(req: NextRequest): NextResponse {
  const token = hasCookie(USER_DATA, { req });
  const url = req.nextUrl.pathname;

  if (protectedRoutes.includes(url) && !token) {
    return NextResponse.redirect(new URL(routes.login, req.url));
  }

  if (unProtectedRoutes.includes(url) && token) {
    return NextResponse.redirect(new URL(routes.profile, req.url));
  }

  return NextResponse.next();
}

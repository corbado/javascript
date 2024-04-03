import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import validateSession from './app/utils/validateSession';

const routes = {
  publicPaths: ['/'],
  privatePaths: ['/dashboard'],
  authPaths: ['/login', '/signup'],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (routes.publicPaths.includes(url.pathname)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('cbo_short_session');
  const shortSession = cookie?.value;
  //TODO: Uncomment the following line to enable session validation after Node SDK has added support for frontend API v2
  // const isSessionValid = await validateSession(shortSession);

  // if (isSessionValid && routes.authPaths.includes(url.pathname)) {
  //   url.pathname = '/dashboard';
  //   return NextResponse.redirect(url);
  // }

  // if (!isSessionValid && routes.privatePaths.find(path => url.pathname.startsWith(path))) {
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

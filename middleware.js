import { NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/webflow_helper';

/**
 * A middleware function that retrieves an access token from Webflow and sets it as a cookie
 * or redirects to the login page if the access token is missing.
 * 
 * @param {import('next/dist/next-server/server/api-utils').NextApiRequest} request - The Next.js API request object.
 * @returns {import('next/dist/next-server/server/api-utils').NextApiResponse} - The Next.js API response object.
 */
export async function middleware(request) {
  // If the request has a code parameter, attempt to get an access token
  if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.get('code')) {
    try {
      const code = request.nextUrl.searchParams.get('code');
      const token = await getAccessToken(code);
      if (token) {
        // If the access token is retrieved successfully, set it as a cookie and return the response
        const response = NextResponse.redirect(new URL('/auth-info', request.url));
        response.cookies.set('webflow_auth', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        });
        return response;
      }
    } catch (error) {
      console.error(`Failed to get access token: ${error}`);
    }
  }

  // If the request doesn't have an access token cookie, redirect to the login page
  if (!request.cookies.get('webflow_auth') || !request.cookies.get('webflow_auth').value) {
    // TODO: Fix the bug where we're redirected to login after authenticating the user.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authorized request is attempting to go home, redirect to the auth-info page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth-info', request.url));
  }

  // If navigating to a site, default to the pages page
  if (/^\/site\/[\w-]+$/.test(request.nextUrl.pathname)) {
    const redirectUrl = new URL(request.nextUrl.href);
    redirectUrl.pathname += '/pages';
    return NextResponse.redirect(redirectUrl);  
  }

  // Else default to proceeding to the next middleware
  return NextResponse.next();
}

// Run this middleware on all pages except /login
export const config = {
  matcher: [
    '/((?!login|api|_next/static|_next/image|favicon.ico).*)',
  ]
};

// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define the paths that should not be accessible when authenticated
const authPages = ['/login', '/register'];

// Define protected routes and their required roles
const protectedRoutes: { [key: string]: string[] } = {
  '/admin': ['admin'], // Only admins can access /admin pages
  '/api/admin': ['admin'], // Only admins can access /api/admin routes
  // Add more routes and roles as needed
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the token to check if the user is authenticated
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Redirect authenticated users away from login and register pages
  if (token && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // Role-based access control
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      if (!token) {
        // User is not authenticated
        if (pathname.startsWith('/api/')) {
          // Return 401 Unauthorized for API routes
          return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        } else {
          // Redirect to login page for client-side routes
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }

      // Check if the user's role is allowed
      const userRole = token.role;
      const allowedRoles = protectedRoutes[route];

      if (!allowedRoles.includes(userRole)) {
        // User does not have the required role
        if (pathname.startsWith('/api/')) {
          // Return 403 Forbidden for API routes
          return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        } else {
          // Redirect to not-authorized page for client-side routes
          return NextResponse.redirect(new URL('/not-authorized', request.url));
        }
      }
    }
  }

  // If none of the above, proceed as normal
  return NextResponse.next();
}

// Specify the paths for which the middleware should run
export const config = {
  matcher: [
    '/login',
    '/register',
    '/admin/:path*',
    '/api/admin/:path*',
    // Add other routes that need middleware
  ],
};

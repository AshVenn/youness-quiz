// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define the paths that should not be accessible when authenticated
const authPages = ['/login', '/register'];

// Define protected routes and their required roles
const protectedRoutes: { [key: string]: string[] } = {
  '/admin': ['admin'], // Only admins can access /admin
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
        // User is not authenticated, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Check if the user's role is allowed
      const userRole = token.role;
      const allowedRoles = protectedRoutes[route];

      if (!allowedRoles.includes(userRole)) {
        // User does not have the required role
        return NextResponse.redirect(new URL('/not-authorized', request.url));
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
    // Add other routes that need middleware
  ],
};

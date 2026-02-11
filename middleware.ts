import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Create a Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return req.cookies.getAll();
        },
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
        },
      },
    }
  );

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define the admin route pattern
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/admin/login';
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  // Allow access to login pages and API auth routes without restriction
  if (isLoginRoute || isApiAuthRoute) {
    // If user is already logged in as admin and tries to access login pages, redirect to admin
    if (isLoginRoute && session) {
      const adminEmail = 'adminjokigameumamusume@gmail.com'; // Ganti dengan email Anda
      if (session.user?.email === adminEmail) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
    // Allow access to login and API auth routes
    return NextResponse.next();
  }

  // Check if user is trying to access admin routes
  if (isAdminRoute) {
    // For all admin routes, require admin session
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if the user's email matches the admin email
    const adminEmail = 'adminjokigameumamusume@gmail.com'; // Ganti dengan email Anda
    if (session.user?.email !== adminEmail) {
      // If user is not the admin, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Continue to the next middleware/route handler
  return NextResponse.next();
}

// Configure the matcher to run for all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
  ],
};
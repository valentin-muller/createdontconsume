import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from './lib/auth'

const publicPaths = ['/login', '/register']
const protectedPaths = ['/dashboard', '/create', '/ideas', '/drafts', '/analytics', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('session')?.value

  // Verify session
  const session = token ? verifySessionToken(token) : null

  // If user is on a public path and is authenticated, redirect to dashboard
  if (publicPaths.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is on a protected path and is not authenticated, redirect to login
  if (protectedPaths.some(path => pathname.startsWith(path)) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect root to appropriate page
  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*', '/create/:path*', '/ideas/:path*', '/drafts/:path*', '/analytics/:path*', '/settings/:path*'],
}

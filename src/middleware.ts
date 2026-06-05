import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl

  const isCoachRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname.startsWith('/auth')
  const isLoggedIn = !!req.auth

  if (isCoachRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}

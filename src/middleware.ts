import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_KEY = 'token'
const USER_DATA = 'user_data'

const protectedPrefixes = [
  '/user',
  '/admin',
  '/properties/addProperty',
  '/properties/edit',
  '/editProperty',
  '/favorites',
  '/saved-searches',
  '/messages',
  '/chat',
]

const guestOnlyRoutes = [
  '/login',
  '/register',
  '/signup',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Retrieve auth cookies
  const token = req.cookies.get(TOKEN_KEY)?.value
  const rawUserData = req.cookies.get(USER_DATA)?.value

  let isAuthenticated = Boolean(token || rawUserData)
  let userRole: string | null = null

  if (rawUserData) {
    try {
      const decoded = decodeURIComponent(rawUserData)
      const parsed = JSON.parse(decoded)
      const user = parsed?.user || parsed?.data?.user || parsed
      if (user?.role) {
        userRole = String(user.role).toLowerCase()
      }
      if (user && !isAuthenticated) {
        isAuthenticated = true
      }
    } catch {
      try {
        const parsed = JSON.parse(rawUserData)
        const user = parsed?.user || parsed?.data?.user || parsed
        if (user?.role) {
          userRole = String(user.role).toLowerCase()
        }
      } catch {
        // Fallback: unparseable cookie
      }
    }
  }

  // 1. Protected routes verification
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Strict Role Verification for Admin routes
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  if (isAdminRoute && isAuthenticated) {
    if (userRole && userRole !== 'admin') {
      // Authenticated but non-admin role: redirect to home
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // 3. Guest-only routes (login, register, signup)
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isGuestOnlyRoute && isAuthenticated) {
    const destination = userRole === 'admin' ? '/admin/dashboard' : '/properties'
    return NextResponse.redirect(new URL(destination, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/properties/addProperty',
    '/favorites',
    '/saved-searches',
    '/messages',
    '/chat',
    '/login',
    '/register',
    '/signup',
  ],
}

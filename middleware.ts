import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_USER_TYPES = ['MODERATOR', 'ADMIN', 'SUPER_ADMIN']

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const pathname = request.nextUrl.pathname

  if (!accessToken) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64url').toString()
    )

    const userType = payload?.user_metadata?.user_type
    const isExpired = payload.exp && payload.exp * 1000 < Date.now()
    const isAuthorized = userType && ALLOWED_USER_TYPES.includes(userType)

    if (isExpired) {
      if (pathname.startsWith('/admin')) {
        const refreshUrl = new URL('/api/auth/refresh-redirect', request.url)
        refreshUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(refreshUrl)
      }
      return NextResponse.next()
    }

    if (isAuthorized && pathname === '/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    if (!isAuthorized && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()

  } catch {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}

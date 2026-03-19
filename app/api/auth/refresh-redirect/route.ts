import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard'

  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!refreshToken) {
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('access_token')
    return res
  }

  try {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        cookie: `refresh_token=${refreshToken}`,
      },
    })

    if (!refreshRes.ok) {
      const res = NextResponse.redirect(new URL('/login', request.url))
      res.cookies.delete('access_token')
      res.cookies.delete('refresh_token')
      return res
    }

    const response = NextResponse.redirect(new URL(redirectTo, request.url))

    // BE sets new access_token via Set-Cookie headers — copy them all
    const setCookies = refreshRes.headers.getSetCookie?.() ?? []
    for (const cookie of setCookies) {
      response.headers.append('set-cookie', cookie)
    }

    return response
  } catch {
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('access_token')
    res.cookies.delete('refresh_token')
    return res
  }
}

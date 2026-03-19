import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const formData = new URLSearchParams()
    if (body.email) formData.append('username', body.email)
    if (body.password) formData.append('password', body.password)

    const res = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Login failed.' },
        { status: res.status }
      )
    }

    const isProduction = process.env.NODE_ENV === 'production'
    const response = NextResponse.json({ user: data.user }, { status: 200 })

    response.cookies.set('access_token', data.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: data.expires_in,
      path: '/',
    })

    response.cookies.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 12, // match BE: 12 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login route error:', error)
    return NextResponse.json({ detail: 'Internal server error.' }, { status: 500 })
  }
}

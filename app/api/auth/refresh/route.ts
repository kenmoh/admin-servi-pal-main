import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL!

export async function POST(request: NextRequest) {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })

    if (!res.ok) {
      const response = NextResponse.json(
        { detail: "Session expired." },
        { status: 401 }
      )
      response.cookies.delete("access_token")
      response.cookies.delete("refresh_token")
      return response
    }

    const data = await res.json()
    const response = NextResponse.json({ user: data })

    const setCookieHeader = res.headers.get("set-cookie")
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader)
    }

    return response

  } catch {
    return NextResponse.json({ detail: "Internal server error." }, { status: 500 })
  }
}
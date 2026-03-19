import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL!

export async function POST(request: NextRequest) {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") || "", 
      },
    })
  } catch (_) {
    // best-effort — always clear cookies on the client side
  }

  const response = NextResponse.json({ message: "Logged out." })
  response.cookies.delete("access_token")
  response.cookies.delete("refresh_token")

  return response
}
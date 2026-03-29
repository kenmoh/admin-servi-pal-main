import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const formData = new URLSearchParams();
    if (body.email) formData.append("username", body.email);
    if (body.password) formData.append("password", body.password);

    const res = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      return NextResponse.json(
        { detail: "Backend returned invalid response." },
        { status: 502 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Login failed." },
        { status: res.status },
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ user: data.user }, { status: 200 });

    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: data.expires_in,
      path: "/",
    });

    response.cookies.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 12, // match BE: 12 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login route error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return NextResponse.json(
      { detail: `Internal server error: ${error.message}` },
      { status: 500 },
    );
  }
}

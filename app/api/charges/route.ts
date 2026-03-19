import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

async function getHeaders(accessToken: string) {
  let userRole = "SUPER_ADMIN";
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    userRole = payload?.user_metadata?.user_type || "SUPER_ADMIN";
  } catch {}
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "X-User-Role": userRole,
  };
}

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const response = await fetch(`${process.env.API_URL}/charges`, {
      headers: await getHeaders(accessToken),
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Failed to fetch charges" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const response = await fetch(`${process.env.API_URL}/charges`, {
      method: "POST",
      headers: await getHeaders(accessToken),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return NextResponse.json(await response.json(), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create charges" }, { status: 500 });
  }
}

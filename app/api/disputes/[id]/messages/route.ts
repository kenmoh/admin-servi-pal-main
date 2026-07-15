import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

async function getUserRole(accessToken: string) {
  let userRole = "ADMIN";
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    userRole = payload?.user_metadata?.user_type || "ADMIN";
  } catch {}
  return userRole;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";
    const url = `${process.env.API_URL}/disputes/${id}/messages?limit=${limit}&offset=${offset}`;
    console.log("[disputes] GET messages", url);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": await getUserRole(accessToken),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[disputes] Backend error:", response.status, errorText);
      throw new Error(errorText || `${response.status}`);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("[disputes] Error fetching dispute messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const url = `${process.env.API_URL}/disputes/${id}/messages`;
    console.log("[disputes] POST message", url, JSON.stringify(body));
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": await getUserRole(accessToken),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[disputes] Backend error:", response.status, errorText);
      throw new Error(errorText || `${response.status}`);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("[disputes] Error sending dispute message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
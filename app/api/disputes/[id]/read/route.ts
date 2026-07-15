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
    const userId = searchParams.get("userId") || "";
    const url = `${process.env.API_URL}/disputes/${id}/read${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`;
    console.log("[disputes] GET read", url);
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
    console.error("[disputes] Error fetching dispute read state:", error);
    return NextResponse.json({ error: "Failed to fetch read state" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = `${process.env.API_URL}/disputes/${id}/read`;
    console.log("[disputes] POST read", url);
    const response = await fetch(url, {
      method: "POST",
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
    console.error("[disputes] Error marking dispute as read:", error);
    return NextResponse.json({ error: "Failed to mark dispute as read" }, { status: 500 });
  }
}
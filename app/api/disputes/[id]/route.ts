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
    const url = `${process.env.API_URL}/disputes/${id}`;
    console.log("[disputes] GET detail", url);
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
    console.error("[disputes] Error fetching dispute:", error);
    return NextResponse.json({ error: "Failed to fetch dispute" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const url = `${process.env.API_URL}/disputes/${id}`;
    console.log("[disputes] PATCH", url, JSON.stringify(body));
    const response = await fetch(url, {
      method: "PATCH",
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
    console.error("[disputes] Error updating dispute:", error);
    return NextResponse.json({ error: "Failed to update dispute" }, { status: 500 });
  }
}

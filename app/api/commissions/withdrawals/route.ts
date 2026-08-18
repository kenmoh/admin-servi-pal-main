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

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of sp.entries()) params.set(k, v);

  try {
    const url = `${process.env.API_URL}/commissions/withdrawals?${params}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": await getUserRole(accessToken),
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("[commissions] Error listing withdrawals:", error);
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const url = `${process.env.API_URL}/commissions/withdrawals`;
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
      throw new Error(errorText || `${response.status}`);
    }
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("[commissions] Error recording withdrawal:", error);
    return NextResponse.json({ error: "Failed to record withdrawal" }, { status: 500 });
  }
}

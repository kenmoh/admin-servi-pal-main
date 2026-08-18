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

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = `${process.env.API_URL}/commissions/withdrawals/balance`;
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
    console.error("[commissions] Error fetching balance:", error);
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}

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

  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const orderType = searchParams.get("order_type");
  if (!orderId || !orderType) {
    return NextResponse.json({ error: "order_id and order_type are required" }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ order_id: orderId, order_type: orderType });
    const url = `${process.env.API_URL}/payouts/status?${params}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": await getUserRole(accessToken),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `${response.status}`);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("[payouts] Error fetching payout status:", error);
    return NextResponse.json({ error: "Failed to fetch payout status" }, { status: 500 });
  }
}

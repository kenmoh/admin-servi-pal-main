import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userRole = "ADMIN";
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    userRole = payload?.user_metadata?.user_type || "ADMIN";
  } catch {}

  const searchParams = request.nextUrl.searchParams;
  const params = new URLSearchParams();
  if (searchParams.get("page")) params.set("page", searchParams.get("page")!);
  if (searchParams.get("transfer_status")) params.set("status", searchParams.get("transfer_status")!);
  if (searchParams.get("account_id")) params.set("account_id", searchParams.get("account_id")!);

  try {
    const url = `${process.env.API_URL}/payouts?${params}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": userRole,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[payouts] Error:", error);
    return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
  }
}

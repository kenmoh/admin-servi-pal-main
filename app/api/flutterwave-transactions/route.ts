import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

const ALLOWED_PARAMS = ["page", "status", "from", "to", "per_page"];

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userRole = "ADMIN";
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString(),
    );
    userRole = payload?.user_metadata?.user_type || "ADMIN";
  } catch {}

  const query = new URLSearchParams();
  for (const key of ALLOWED_PARAMS) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) query.set(key, value);
  }

  try {
    const url = `${process.env.API_URL}/beneficiaries/flutterwave-transactions?${query}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": userRole,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch flutterwave transactions: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching flutterwave transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch flutterwave transactions" },
      { status: 500 },
    );
  }
}

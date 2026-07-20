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
  const params = new URLSearchParams({
    page: searchParams.get("page") || "1",
  });

  try {
    const url = `${process.env.API_URL}/beneficiaries?${params}`;
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
    console.error("[beneficiaries] Error:", error);
    return NextResponse.json({ error: "Failed to fetch beneficiaries" }, { status: 500 });
  }
}

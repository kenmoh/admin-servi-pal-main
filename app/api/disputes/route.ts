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
    limit: searchParams.get("limit") || "20",
    ...(searchParams.get("status") && { status: searchParams.get("status")! }),
    ...(searchParams.get("search") && { search: searchParams.get("search")! }),
  });

  try {
    const response = await fetch(`${process.env.API_URL}/disputes?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": userRole,
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
  }
}

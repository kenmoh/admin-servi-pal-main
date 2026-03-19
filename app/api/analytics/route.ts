import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

async function proxyGet(path: string, accessToken: string, params?: URLSearchParams) {
  let userRole = "ADMIN";
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    userRole = payload?.user_metadata?.user_type || "ADMIN";
  } catch {}

  const url = `${process.env.API_URL}/analytics/${path}${params?.toString() ? `?${params}` : ""}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-User-Role": userRole,
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const endpoint = sp.get("endpoint") || "overview";

  const params = new URLSearchParams();
  for (const [k, v] of sp.entries()) {
    if (k !== "endpoint") params.set(k, v);
  }

  try {
    const data = await proxyGet(endpoint, accessToken, params);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch analytics/${endpoint}` }, { status: 500 });
  }
}

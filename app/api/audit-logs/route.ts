import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userRole = "SUPER_ADMIN";
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    userRole = payload?.user_metadata?.user_type || "SUPER_ADMIN";
  } catch {}

  const sp = request.nextUrl.searchParams;
  const params = new URLSearchParams();
  params.set("page", sp.get("page") || "1");
  params.set("page_size", sp.get("page_size") || "20");
  for (const key of ["entity_type", "entity_id", "action", "actor_id", "date_from", "date_to"]) {
    const val = sp.get(key);
    if (val) params.set(key, val);
  }

  try {
    const response = await fetch(`${process.env.API_URL}/audit-logs?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": userRole,
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userRole = "SUPER_ADMIN";
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    userRole = payload?.user_metadata?.user_type || "SUPER_ADMIN";
  } catch {}

  try {
    const body = await request.json();
    const response = await fetch(`${process.env.API_URL}/charges/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": userRole,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Failed to update charges" }, { status: 500 });
  }
}

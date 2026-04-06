import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const response = await fetch(`${process.env.API_URL}/admin/users/${id}/verify`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    const result = await response.json();
    console.log(result);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to verify user" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ProfileDetail } from "@/types/user-types";
import { getAccessToken } from "@/util/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userRole;
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString(),
    );
    userRole = payload?.user_metadata?.user_type;
  } catch {}

  try {
    const response = await fetch(
      `${process.env.API_URL}/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-User-Role": userRole,
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("External API error:", response.status, errorBody);
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const data: ProfileDetail = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ManagementUserCreate } from "@/types/user-types";
import { getAccessToken } from "@/util/utils";

export async function POST(request: NextRequest) {
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

  try {
    const body: ManagementUserCreate = await request.json();

    const response = await fetch(`${process.env.API_URL}/admin/management`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-User-Role": userRole,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ detail: "Unknown error" }));
      return NextResponse.json(
        { error: errorBody.detail || "Failed to create user" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating management user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

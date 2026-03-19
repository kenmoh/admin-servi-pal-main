import { NextRequest, NextResponse } from "next/server";
import { ProfileListResponse } from "@/types/user-types";
import { getAccessToken } from "@/util/utils";

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

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search");
    const user_type = searchParams.get("user_type");
    const account_status = searchParams.get("account_status");

    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(user_type && { user_type }),
      ...(account_status && { account_status }),
    });

    const response = await fetch(
      `${process.env.API_URL}/admin/users?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-User-Role": userRole,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: response.status })
    }

    const data: ProfileListResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

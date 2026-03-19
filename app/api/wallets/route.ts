import { NextRequest, NextResponse } from "next/server";
import { WalletListResponse } from "@/types/user-types";
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
  } catch {
    // fallback to default role
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search");

    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    });

    const response = await fetch(
      `${process.env.API_URL}/admin/wallets?${params}`,
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
      throw new Error(`Failed to fetch wallets: ${response.status}`);
    }

    const data: WalletListResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
      { status: 500 },
    );
  }
}

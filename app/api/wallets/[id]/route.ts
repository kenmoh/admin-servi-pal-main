import { NextRequest, NextResponse } from "next/server";
import { WalletWithTransactions } from "@/types/user-types";
import { getAccessToken } from "@/util/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = await getAccessToken();
  const { id } = await params;

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
    const response = await fetch(
      `${process.env.API_URL}/admin/wallets/${id}`,
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
      throw new Error(`Failed to fetch wallet: ${response.status} Error: ${errorBody}`);
    }

    const data: WalletWithTransactions = await response.json();
    console.log(data)
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 },
    );
  }
}

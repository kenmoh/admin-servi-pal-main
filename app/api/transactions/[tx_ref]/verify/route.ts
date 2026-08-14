import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ tx_ref: string }> },
) {
  const { tx_ref } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/analytics/${encodeURIComponent(tx_ref)}/verify-transaction`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to verify transaction: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return NextResponse.json(
      { error: "Failed to verify transaction" },
      { status: 500 },
    );
  }
}
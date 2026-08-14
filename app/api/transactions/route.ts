import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

const ALLOWED_PARAMS = [
  "page",
  "page_size",
  "payment_status",
  "transaction_type",
  "order_type",
  "wallet_id",
  "from_user_id",
  "to_user_id",
  "order_id",
  "tx_ref",
  "start_date",
  "end_date",
  "sort_by",
  "sort_order",
];

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = new URLSearchParams();
  for (const key of ALLOWED_PARAMS) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) query.set(key, value);
  }

  const url = `${process.env.API_URL}/analytics/transactions?${query}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
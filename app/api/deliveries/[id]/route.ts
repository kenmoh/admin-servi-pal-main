import { NextRequest, NextResponse } from "next/server";
import { DeliveryOrderDetail } from "@/types/delivery-types";
import { getAccessToken } from "@/util/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Decode JWT payload to get user metadata (verification happens in FastAPI)
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
      `${process.env.API_URL}/delivery-orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-User-Role": userRole,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch delivery");
    }

    const data: DeliveryOrderDetail = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching delivery:", error);
    return NextResponse.json(
      { error: "Failed to fetch delivery" },
      { status: 500 },
    );
  }
}

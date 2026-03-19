import { NextRequest, NextResponse } from "next/server";
import { DeliveryOrderListResponse } from "@/types/delivery-types";
import { getAccessToken } from "@/util/utils";

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search");
    const delivery_status = searchParams.get("delivery_status");

    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(delivery_status && { delivery_status }),
    });

    const response = await fetch(
      `${process.env.API_URL}/delivery-orders?${params}`,
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
      throw new Error(`Failed to fetch deliveries: ${response.status}`);
    }

    const data: DeliveryOrderListResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json(
      { error: "Failed to fetch deliveries" },
      { status: 500 },
    );
  }
}

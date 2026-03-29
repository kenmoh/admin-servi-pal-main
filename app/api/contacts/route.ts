import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let backendUrl = `${process.env.API_URL}/admin/contacts/?page=${page}&page_size=${limit}`;
  
  if (category) {
    backendUrl += `&category=${encodeURIComponent(category)}`;
  }
  
  if (search) {
    backendUrl += `&search=${encodeURIComponent(search)}`;
  }

  try {
    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("External API error:", response.status, errorBody);
      return NextResponse.json(
        { error: `Failed to fetch contacts: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

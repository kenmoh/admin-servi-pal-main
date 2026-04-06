import { NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const response = await fetch(`${process.env.API_URL}/charges`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch charges" }, { status: 500 });
  }
}

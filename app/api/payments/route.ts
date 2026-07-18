import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

async function proxyPaymentEndpoint(
  path: string,
  accessToken: string,
  method: string = "GET",
  body?: unknown
) {
  let userRole = "ADMIN";
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString()
    );
    userRole = payload?.user_metadata?.user_type || "ADMIN";
  } catch {}

  const url = `${process.env.API_URL}/monitoring/payments/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-User-Role": userRole,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const endpoint = sp.get("endpoint") || "health";

  const params = new URLSearchParams();
  for (const [k, v] of sp.entries()) {
    if (k !== "endpoint") params.set(k, v);
  }

  const queryString = params.toString();
  const path = queryString ? `${endpoint}?${queryString}` : endpoint;

  try {
    const data = await proxyPaymentEndpoint(path, accessToken);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to fetch payment monitoring/${endpoint}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const endpoint = sp.get("endpoint") || "";
  const body = await request.json().catch(() => ({}));

  try {
    const data = await proxyPaymentEndpoint(endpoint, accessToken, "POST", body);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to POST payment monitoring/${endpoint}` },
      { status: 500 }
    );
  }
}

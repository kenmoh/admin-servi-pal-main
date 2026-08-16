import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/util/utils";

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString(),
    );

    const meta = payload?.user_metadata ?? {};
    const profile = payload?.profile ?? payload?.user ?? {};

    const user = {
      id: payload?.sub ?? payload?.user_id ?? profile?.id ?? "",
      email: payload?.email ?? meta?.email ?? profile?.email ?? "",
      name:
        meta?.full_name ??
        meta?.name ??
        profile?.full_name ??
        profile?.name ??
        "",
      avatar:
        meta?.profile_image_url ??
        meta?.avatar ??
        profile?.profile_image_url ??
        profile?.avatar ??
        "",
      role: meta?.user_type ?? payload?.role ?? "",
    };

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
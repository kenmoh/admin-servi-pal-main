export const BASE_URL = "https://api.servi-pal.com/api/v1";

import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("access_token");
  return accessTokenCookie?.value;
}

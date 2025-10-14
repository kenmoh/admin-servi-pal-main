import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_PATHS = ["/", "/login", "/privacy", "/terms", "/about", "/faqs", "/support",  "/.well-known/assetlinks.json"];

function isJwtExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Check for access_token instead of jwt
  const accessToken = request.cookies.get("access_token")?.value || "";
  
  if (!accessToken || isJwtExpired(accessToken)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clear both tokens
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

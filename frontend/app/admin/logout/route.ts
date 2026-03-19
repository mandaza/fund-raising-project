import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/admin-session";

export async function GET(request: NextRequest) {
  const nextPath = request.nextUrl.searchParams.get("next") || "/admin/login";
  const cleanupUrl = new URL("/admin/logout/cleanup", request.url);

  cleanupUrl.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(cleanupUrl);
  response.cookies.delete(ADMIN_TOKEN_COOKIE);

  return response;
}

import { NextResponse } from "next/server";
import { clearSessionCookie, isAllowedOrigin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}

import { NextResponse } from "next/server";
import {
  applySessionCookie,
  createSessionToken,
  isAdminConfigured,
  isAllowedOrigin,
  verifyPassword,
} from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function tooManyAttempts(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { message: "ADMIN_PASSWORD ortam değişkeni tanımlı değil." },
      { status: 500 },
    );
  }

  const key = clientKey(request);
  if (tooManyAttempts(key)) {
    return NextResponse.json(
      { message: "Çok fazla deneme. 15 dakika sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as { password?: string };
  if (!verifyPassword(body.password ?? "")) {
    return NextResponse.json({ message: "Şifre hatalı." }, { status: 401 });
  }

  attempts.delete(key);
  const response = NextResponse.json({ ok: true });
  applySessionCookie(response, createSessionToken());
  return response;
}

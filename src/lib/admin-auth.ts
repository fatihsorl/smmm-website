import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "soral_admin_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export function hasVisionProvider() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  const given = password.trim();
  if (!expected || !given) {
    return false;
  }
  return safeEqual(given, expected);
}

export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token || !getSecret()) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [expiresAt, nonce, signature] = parts;
  const payload = `${expiresAt}.${nonce}`;
  if (!safeEqual(signature, sign(payload))) {
    return false;
  }

  return Number(expiresAt) > Date.now();
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminRequest() {
  const jar = await cookies();
  return readSessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const host = request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

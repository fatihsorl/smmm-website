import { NextResponse } from "next/server";
import { hasVisionProvider, isAdminConfigured, isAdminRequest } from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isAdminRequest();
  return NextResponse.json({
    authenticated,
    configured: isAdminConfigured(),
    visionReady: hasVisionProvider(),
  });
}

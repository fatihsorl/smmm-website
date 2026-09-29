import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import { getMukellefKarti } from "@/lib/mukellef-db";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ message: "Geçersiz mükellef id." }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const yil = Number(searchParams.get("yil"));
  if (!Number.isInteger(yil) || yil < 2000 || yil > 2100) {
    return NextResponse.json({ message: "Geçersiz yıl." }, { status: 400 });
  }

  try {
    const kart = await getMukellefKarti(id, yil);
    if (!kart) {
      return NextResponse.json({ message: "Mükellef bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(kart);
  } catch (error) {
    console.error("Mükellef kartı hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Kart alınamadı." },
      { status: 500 },
    );
  }
}

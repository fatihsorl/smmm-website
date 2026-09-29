import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import { createMukellef, listMukellefler } from "@/lib/mukellef-db";
import type { MukellefInput } from "@/lib/mukellef-types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("hepsi") === "1";

  try {
    const rows = await listMukellefler(includeInactive);
    return NextResponse.json({ rows });
  } catch (error) {
    console.error("Mükellef listeleme hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Liste alınamadı." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const body = (await request.json()) as Partial<MukellefInput>;
  if (!body.unvan?.trim()) {
    return NextResponse.json({ message: "Unvan zorunlu." }, { status: 400 });
  }

  try {
    const mukellef = await createMukellef({
      sira: body.sira ?? null,
      unvan: body.unvan.trim(),
      tamUnvan: body.tamUnvan ?? "",
      ticaretSicilNo: body.ticaretSicilNo ?? "",
      mersis: body.mersis ?? "",
      vergiNo: body.vergiNo ?? "",
      tckn: body.tckn ?? "",
      gibKullaniciKodu: body.gibKullaniciKodu ?? "",
      gibSifre: body.gibSifre ?? "",
      sgkKullaniciAdi: body.sgkKullaniciAdi ?? "",
      sgkSistemSifre: body.sgkSistemSifre ?? "",
      sgkIsyeriSifre: body.sgkIsyeriSifre ?? "",
      sgkAylik: body.sgkAylik ?? "",
      eDefter: body.eDefter ?? "",
      muhtasar: body.muhtasar ?? "",
      nevi: body.nevi ?? "",
      ucret: body.ucret ?? null,
      sermaye: body.sermaye ?? null,
      gecenYildanBorclar: body.gecenYildanBorclar ?? null,
      not2: body.not2 ?? "",
      adres: body.adres ?? "",
      kullanim: body.kullanim ?? "",
    });
    return NextResponse.json({ mukellef });
  } catch (error) {
    console.error("Mükellef oluşturma hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Mükellef oluşturulamadı." },
      { status: 500 },
    );
  }
}

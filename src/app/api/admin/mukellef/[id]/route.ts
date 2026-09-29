import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import { getMukellef, setMukellefAktif, updateMukellef } from "@/lib/mukellef-db";
import type { MukellefInput } from "@/lib/mukellef-types";

export const runtime = "nodejs";

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz mükellef id." }, { status: 400 });
  }

  try {
    const mukellef = await getMukellef(id);
    if (!mukellef) {
      return NextResponse.json({ message: "Mükellef bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ mukellef });
  } catch (error) {
    console.error("Mükellef okuma hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Mükellef alınamadı." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz mükellef id." }, { status: 400 });
  }

  const body = (await request.json()) as Partial<MukellefInput>;
  if (!body.unvan?.trim()) {
    return NextResponse.json({ message: "Unvan zorunlu." }, { status: 400 });
  }

  try {
    const mukellef = await updateMukellef(id, {
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
    if (!mukellef) {
      return NextResponse.json({ message: "Mükellef bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ mukellef });
  } catch (error) {
    console.error("Mükellef güncelleme hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Mükellef güncellenemedi." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz mükellef id." }, { status: 400 });
  }

  try {
    await setMukellefAktif(id, false);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Mükellef silme hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Mükellef silinemedi." },
      { status: 500 },
    );
  }
}

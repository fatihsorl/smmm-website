import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import { getAylikTakip, upsertTakipDurumu } from "@/lib/mukellef-db";
import type { TakipDurum, TakipKategori } from "@/lib/mukellef-types";

export const runtime = "nodejs";

const DONEM_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const KATEGORILER: TakipKategori[] = ["kdv1", "kdv2", "muhtasar", "sgk", "gecici", "edefter", "banka"];
const DURUMLAR: TakipDurum[] = ["tamamlandi", "bekliyor", "tabi_degil"];

export async function GET(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const donem = searchParams.get("donem") ?? "";
  if (!DONEM_PATTERN.test(donem)) {
    return NextResponse.json({ message: "Geçersiz dönem (YYYY-MM bekleniyor)." }, { status: 400 });
  }

  try {
    const rows = await getAylikTakip(donem);
    return NextResponse.json({ rows });
  } catch (error) {
    console.error("Aylık takip listeleme hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Liste alınamadı." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const body = (await request.json()) as {
    mukellefId?: number;
    donem?: string;
    kategori?: TakipKategori;
    durum?: TakipDurum;
    notMetni?: string;
  };

  if (
    !body.mukellefId ||
    !body.donem ||
    !DONEM_PATTERN.test(body.donem) ||
    !body.kategori ||
    !KATEGORILER.includes(body.kategori) ||
    !body.durum ||
    !DURUMLAR.includes(body.durum)
  ) {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  try {
    const hucre = await upsertTakipDurumu({
      mukellefId: body.mukellefId,
      donem: body.donem,
      kategori: body.kategori,
      durum: body.durum,
      notMetni: body.notMetni,
    });
    return NextResponse.json({ hucre });
  } catch (error) {
    console.error("Takip durumu güncelleme hatası:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Durum güncellenemedi." },
      { status: 500 },
    );
  }
}

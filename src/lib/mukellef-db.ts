import { getSql } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/credential-crypto";
import {
  AYLAR,
  GECICI_VERGI_AYLARI,
  TAKIP_KATEGORILERI,
  type AylikTakipSatiri,
  type Mukellef,
  type MukellefInput,
  type MukellefListItem,
  type TakipDurum,
  type TakipHucre,
  type TakipKategori,
} from "@/lib/mukellef-types";

type MukellefRow = {
  id: number;
  sira: number | null;
  unvan: string;
  tam_unvan: string;
  ticaret_sicil_no: string;
  mersis: string;
  vergi_no: string;
  tckn: string;
  gib_kullanici_kodu: string;
  gib_sifre_enc: string;
  sgk_kullanici_adi: string;
  sgk_sistem_sifre_enc: string;
  sgk_isyeri_sifre_enc: string;
  sgk_aylik: string;
  e_defter: string;
  muhtasar: string;
  nevi: string;
  ucret: string | null;
  sermaye: string | null;
  gecen_yildan_borclar: string | null;
  not2: string;
  adres: string;
  kullanim: string;
  aktif: boolean;
  created_at: string;
  updated_at: string;
};

function toNumber(value: string | null): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rowToMukellef(row: MukellefRow): Mukellef {
  return {
    id: row.id,
    sira: row.sira,
    unvan: row.unvan,
    tamUnvan: row.tam_unvan,
    ticaretSicilNo: row.ticaret_sicil_no,
    mersis: row.mersis,
    vergiNo: row.vergi_no,
    tckn: row.tckn,
    gibKullaniciKodu: row.gib_kullanici_kodu,
    gibSifre: decryptSecret(row.gib_sifre_enc),
    sgkKullaniciAdi: row.sgk_kullanici_adi,
    sgkSistemSifre: decryptSecret(row.sgk_sistem_sifre_enc),
    sgkIsyeriSifre: decryptSecret(row.sgk_isyeri_sifre_enc),
    sgkAylik: row.sgk_aylik,
    eDefter: row.e_defter,
    muhtasar: row.muhtasar,
    nevi: row.nevi,
    ucret: toNumber(row.ucret),
    sermaye: toNumber(row.sermaye),
    gecenYildanBorclar: toNumber(row.gecen_yildan_borclar),
    not2: row.not2,
    adres: row.adres,
    kullanim: row.kullanim,
    aktif: row.aktif,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToListItem(row: MukellefRow): MukellefListItem {
  const { gibSifre, sgkSistemSifre, sgkIsyeriSifre, ...rest } = rowToMukellef(row);
  void gibSifre;
  void sgkSistemSifre;
  void sgkIsyeriSifre;
  return rest;
}

export async function listMukellefler(includeInactive = false): Promise<MukellefListItem[]> {
  const sql = getSql();
  const rows = includeInactive
    ? ((await sql`SELECT * FROM mukellefler ORDER BY sira NULLS LAST, unvan;`) as MukellefRow[])
    : ((await sql`SELECT * FROM mukellefler WHERE aktif = true ORDER BY sira NULLS LAST, unvan;`) as MukellefRow[]);
  return rows.map(rowToListItem);
}

export async function getMukellef(id: number): Promise<Mukellef | null> {
  const sql = getSql();
  const rows = (await sql`SELECT * FROM mukellefler WHERE id = ${id};`) as MukellefRow[];
  return rows[0] ? rowToMukellef(rows[0]) : null;
}

export async function createMukellef(input: MukellefInput): Promise<Mukellef> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO mukellefler (
      sira, unvan, tam_unvan, ticaret_sicil_no, mersis, vergi_no, tckn,
      gib_kullanici_kodu, gib_sifre_enc, sgk_kullanici_adi, sgk_sistem_sifre_enc, sgk_isyeri_sifre_enc,
      sgk_aylik, e_defter, muhtasar, nevi, ucret, sermaye, gecen_yildan_borclar, not2, adres, kullanim
    ) VALUES (
      ${input.sira}, ${input.unvan}, ${input.tamUnvan}, ${input.ticaretSicilNo}, ${input.mersis}, ${input.vergiNo}, ${input.tckn},
      ${input.gibKullaniciKodu}, ${encryptSecret(input.gibSifre)}, ${input.sgkKullaniciAdi}, ${encryptSecret(input.sgkSistemSifre)}, ${encryptSecret(input.sgkIsyeriSifre)},
      ${input.sgkAylik}, ${input.eDefter}, ${input.muhtasar}, ${input.nevi}, ${input.ucret}, ${input.sermaye}, ${input.gecenYildanBorclar}, ${input.not2}, ${input.adres}, ${input.kullanim}
    )
    RETURNING *;
  `) as MukellefRow[];
  return rowToMukellef(rows[0]);
}

export async function updateMukellef(id: number, input: MukellefInput): Promise<Mukellef | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE mukellefler SET
      sira = ${input.sira},
      unvan = ${input.unvan},
      tam_unvan = ${input.tamUnvan},
      ticaret_sicil_no = ${input.ticaretSicilNo},
      mersis = ${input.mersis},
      vergi_no = ${input.vergiNo},
      tckn = ${input.tckn},
      gib_kullanici_kodu = ${input.gibKullaniciKodu},
      gib_sifre_enc = ${encryptSecret(input.gibSifre)},
      sgk_kullanici_adi = ${input.sgkKullaniciAdi},
      sgk_sistem_sifre_enc = ${encryptSecret(input.sgkSistemSifre)},
      sgk_isyeri_sifre_enc = ${encryptSecret(input.sgkIsyeriSifre)},
      sgk_aylik = ${input.sgkAylik},
      e_defter = ${input.eDefter},
      muhtasar = ${input.muhtasar},
      nevi = ${input.nevi},
      ucret = ${input.ucret},
      sermaye = ${input.sermaye},
      gecen_yildan_borclar = ${input.gecenYildanBorclar},
      not2 = ${input.not2},
      adres = ${input.adres},
      kullanim = ${input.kullanim},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *;
  `) as MukellefRow[];
  return rows[0] ? rowToMukellef(rows[0]) : null;
}

export async function setMukellefAktif(id: number, aktif: boolean): Promise<void> {
  const sql = getSql();
  await sql`UPDATE mukellefler SET aktif = ${aktif}, updated_at = now() WHERE id = ${id};`;
}

function ayNoFromDonem(donem: string) {
  const ay = Number(donem.split("-")[1]);
  return Number.isFinite(ay) ? ay : 0;
}

/** SGK ve Geçici için otomatik "tabi değil" kuralını uygular; diğer kategorilerde saklanan durumu döner. */
function deriveHucre(
  kategori: TakipKategori,
  sgkAylik: string,
  donem: string,
  stored: { durum: TakipDurum; notMetni: string } | undefined,
): TakipHucre {
  if (kategori === "sgk" && sgkAylik.trim().toLocaleUpperCase("tr-TR") !== "AYLIK") {
    return { kategori, durum: "tabi_degil", duzenlenebilir: false, notMetni: "" };
  }
  if (kategori === "gecici" && !GECICI_VERGI_AYLARI.has(ayNoFromDonem(donem))) {
    return { kategori, durum: "tabi_degil", duzenlenebilir: false, notMetni: "" };
  }
  return {
    kategori,
    durum: stored?.durum ?? "bekliyor",
    duzenlenebilir: true,
    notMetni: stored?.notMetni ?? "",
  };
}

export async function getAylikTakip(donem: string): Promise<AylikTakipSatiri[]> {
  const sql = getSql();
  const mukellefler = (await sql`
    SELECT id, unvan, sgk_aylik, e_defter, muhtasar FROM mukellefler
    WHERE aktif = true ORDER BY sira NULLS LAST, unvan;
  `) as Array<{ id: number; unvan: string; sgk_aylik: string; e_defter: string; muhtasar: string }>;

  const durumlar = (await sql`
    SELECT mukellef_id, kategori, durum, not_metni FROM takip_durumlari WHERE donem = ${donem};
  `) as Array<{ mukellef_id: number; kategori: TakipKategori; durum: TakipDurum; not_metni: string }>;

  const durumMap = new Map<string, { durum: TakipDurum; notMetni: string }>();
  for (const row of durumlar) {
    durumMap.set(`${row.mukellef_id}:${row.kategori}`, { durum: row.durum, notMetni: row.not_metni });
  }

  return mukellefler.map((m) => ({
    mukellefId: m.id,
    unvan: m.unvan,
    sgkAylik: m.sgk_aylik,
    eDefter: m.e_defter,
    muhtasar: m.muhtasar,
    hucreler: TAKIP_KATEGORILERI.map(({ key }) =>
      deriveHucre(key, m.sgk_aylik, donem, durumMap.get(`${m.id}:${key}`)),
    ),
  }));
}

export async function upsertTakipDurumu(params: {
  mukellefId: number;
  donem: string;
  kategori: TakipKategori;
  durum: TakipDurum;
  notMetni?: string;
}): Promise<TakipHucre> {
  const sql = getSql();
  const mukellefRows = (await sql`
    SELECT sgk_aylik FROM mukellefler WHERE id = ${params.mukellefId} AND aktif = true;
  `) as Array<{ sgk_aylik: string }>;
  if (mukellefRows.length === 0) {
    throw new Error("Mükellef bulunamadı.");
  }
  const sgkAylik = mukellefRows[0].sgk_aylik;

  const locked = deriveHucre(params.kategori, sgkAylik, params.donem, undefined);
  if (!locked.duzenlenebilir) {
    throw new Error("Bu hücre otomatik 'Tabi değil' olarak işaretlenmiş, elle değiştirilemez.");
  }

  const notMetni = params.notMetni ?? "";
  await sql`
    INSERT INTO takip_durumlari (mukellef_id, donem, kategori, durum, not_metni)
    VALUES (${params.mukellefId}, ${params.donem}, ${params.kategori}, ${params.durum}, ${notMetni})
    ON CONFLICT (mukellef_id, donem, kategori)
    DO UPDATE SET durum = excluded.durum, not_metni = excluded.not_metni, updated_at = now();
  `;

  return { kategori: params.kategori, durum: params.durum, duzenlenebilir: true, notMetni };
}

export async function getMukellefKarti(id: number, yil: number) {
  const mukellef = await getMukellef(id);
  if (!mukellef) {
    return null;
  }

  const sql = getSql();
  const durumlar = (await sql`
    SELECT donem, kategori, durum, not_metni FROM takip_durumlari
    WHERE mukellef_id = ${id} AND donem LIKE ${`${yil}-%`};
  `) as Array<{ donem: string; kategori: TakipKategori; durum: TakipDurum; not_metni: string }>;

  const durumMap = new Map<string, { durum: TakipDurum; notMetni: string }>();
  for (const row of durumlar) {
    durumMap.set(`${row.donem}:${row.kategori}`, { durum: row.durum, notMetni: row.not_metni });
  }

  const aylar = AYLAR.map((ayAdi, index) => {
    const donem = `${yil}-${String(index + 1).padStart(2, "0")}`;
    return {
      donem,
      ayAdi,
      hucreler: TAKIP_KATEGORILERI.map(({ key }) =>
        deriveHucre(key, mukellef.sgkAylik, donem, durumMap.get(`${donem}:${key}`)),
      ),
    };
  });

  return { mukellef, aylar };
}

export type TakipKategori =
  | "kdv1"
  | "kdv2"
  | "muhtasar"
  | "sgk"
  | "gecici"
  | "edefter"
  | "banka";

export const TAKIP_KATEGORILERI: Array<{ key: TakipKategori; label: string }> = [
  { key: "kdv1", label: "KDV 1" },
  { key: "kdv2", label: "KDV 2" },
  { key: "muhtasar", label: "Muhtasar" },
  { key: "sgk", label: "SGK" },
  { key: "gecici", label: "Geçici" },
  { key: "edefter", label: "E-Defter" },
  { key: "banka", label: "Banka" },
];

export type TakipDurum = "tamamlandi" | "bekliyor" | "tabi_degil";

export type Mukellef = {
  id: number;
  sira: number | null;
  unvan: string;
  tamUnvan: string;
  ticaretSicilNo: string;
  mersis: string;
  vergiNo: string;
  tckn: string;
  gibKullaniciKodu: string;
  gibSifre: string;
  sgkKullaniciAdi: string;
  sgkSistemSifre: string;
  sgkIsyeriSifre: string;
  sgkAylik: string;
  eDefter: string;
  muhtasar: string;
  nevi: string;
  ucret: number | null;
  sermaye: number | null;
  gecenYildanBorclar: number | null;
  not2: string;
  adres: string;
  kullanim: string;
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MukellefListItem = Omit<
  Mukellef,
  "gibSifre" | "sgkSistemSifre" | "sgkIsyeriSifre"
>;

export type MukellefInput = Omit<
  Mukellef,
  "id" | "createdAt" | "updatedAt" | "aktif"
>;

export type TakipHucre = {
  kategori: TakipKategori;
  durum: TakipDurum;
  duzenlenebilir: boolean;
  notMetni: string;
};

export type AylikTakipSatiri = {
  mukellefId: number;
  unvan: string;
  sgkAylik: string;
  eDefter: string;
  muhtasar: string;
  hucreler: TakipHucre[];
};

export const AYLAR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

export const GECICI_VERGI_AYLARI = new Set([2, 5, 8, 11]);

export function donemLabel(donem: string) {
  const [yil, ay] = donem.split("-").map(Number);
  return `${AYLAR[(ay ?? 1) - 1]} ${yil}`;
}

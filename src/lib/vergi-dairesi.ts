import { VERGI_DAIRELERI } from "@/data/vergi-daireleri";

const SUFFIX_PATTERN =
  /\b(VERGİ DAİRESİ BAŞKANLIĞI|VERGİ DAİRESİ MÜDÜRLÜĞÜ|MALMÜDÜRLÜĞÜ|VERGİ DAİRESİ|V\.?\s?D\.?)\b/g;

function normalize(value: string) {
  return value
    .toLocaleUpperCase("tr-TR")
    .replace(/[^A-ZÇĞİÖŞÜ0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shortForm(value: string) {
  const upper = value.toLocaleUpperCase("tr-TR").replace(SUFFIX_PATTERN, " ");
  return normalize(upper);
}

const ASCII_FOLD_MAP: Record<string, string> = {
  Ç: "C",
  Ğ: "G",
  İ: "I",
  I: "I",
  Ö: "O",
  Ş: "S",
  Ü: "U",
};

function foldAscii(value: string) {
  return value.replace(/[ÇĞİÖŞÜ]/g, (ch) => ASCII_FOLD_MAP[ch] ?? ch);
}

type Entry = { kod: string; ad: string; full: string; short: string; ascii: string };

let index: Entry[] | null = null;

function buildIndex(): Entry[] {
  if (!index) {
    index = VERGI_DAIRELERI.map((item) => {
      const short = shortForm(item.ad);
      return {
        kod: item.kod,
        ad: item.ad,
        full: normalize(item.ad),
        short,
        ascii: foldAscii(short),
      };
    });
  }
  return index;
}

const CODE_PATTERN = /^\d{6}$/;

export type VergiDairesiMatch = {
  kod: string | null;
  matchedAd: string | null;
};

/**
 * OCR'dan gelen serbest metin (vergi dairesi adı ya da kodu) için resmi kod bulur.
 * Tam eşleşme yoksa kısaltılmış/parçalı eşleşmeye düşer; hiçbiri tutmazsa null döner.
 */
export function resolveVergiDairesiKodu(raw: string): VergiDairesiMatch {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { kod: null, matchedAd: null };
  }

  if (CODE_PATTERN.test(trimmed)) {
    return { kod: trimmed, matchedAd: null };
  }

  const entries = buildIndex();
  const inputFull = normalize(trimmed);
  const inputShort = shortForm(trimmed);
  const inputAscii = foldAscii(inputShort);

  if (!inputShort) {
    return { kod: null, matchedAd: null };
  }

  const exactFull = entries.find((entry) => entry.full === inputFull);
  if (exactFull) {
    return { kod: exactFull.kod, matchedAd: exactFull.ad };
  }

  const exactShort = entries.find((entry) => entry.short === inputShort);
  if (exactShort) {
    return { kod: exactShort.kod, matchedAd: exactShort.ad };
  }

  const exactAscii = entries.find((entry) => entry.ascii === inputAscii);
  if (exactAscii) {
    return { kod: exactAscii.kod, matchedAd: exactAscii.ad };
  }

  const partial = entries
    .filter((entry) => entry.short.includes(inputShort) || inputShort.includes(entry.short))
    .sort((a, b) => Math.abs(a.short.length - inputShort.length) - Math.abs(b.short.length - inputShort.length));

  if (partial.length === 1) {
    return { kod: partial[0].kod, matchedAd: partial[0].ad };
  }

  const partialAscii = entries
    .filter((entry) => entry.ascii.includes(inputAscii) || inputAscii.includes(entry.ascii))
    .sort((a, b) => Math.abs(a.ascii.length - inputAscii.length) - Math.abs(b.ascii.length - inputAscii.length));

  if (partialAscii.length === 1) {
    return { kod: partialAscii[0].kod, matchedAd: partialAscii[0].ad };
  }

  return { kod: null, matchedAd: null };
}

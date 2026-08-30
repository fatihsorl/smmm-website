import { randomUUID } from "node:crypto";
import {
  DEFAULT_ALIS_TURU,
  DEFAULT_GIDER_ALT_TURU,
  DEFAULT_GIDER_KAYIT_TURU,
  GIDER_KAYIT_ALT_TURLERI,
  KDV_ORANLARI,
} from "@/data/okc-lookups";
import type { InvoiceRow } from "@/lib/invoice-types";

const EXTRACT_PROMPT = `Sen Türkiye'de mali müşavirler için fatura / ÖKC (yazar kasa) fişi okuyan bir asistanısın.
Görüntüdeki veya PDF'teki belgeden GİB İşletme Defteri "ÖKC Fişi Gider" Excel satırlarını çıkar.

Kurallar:
- Sadece gördüğün bilgileri yaz. Uydurma.
- Bir fotoğrafta veya PDF'te birden fazla fiş / fatura varsa HER BELGE için ayrı satır üret. Hiçbirini atlama.
- PDF ise TÜM sayfaları oku. Sayfa atlama. Her sayfadaki her belge ayrı satır olsun.
- Tarihleri YYYY-MM-DD formatında ver.
- Tutarları nokta ondalıklı sayı olarak ver (ör. 1250.50). Binlik ayırıcı kullanma.
- VKN 10 haneli, TCKN 11 haneli olmalı. Boşluk ve nokta olmadan. "VD 0012797224" gibi yazımlarda yalnızca rakamı al.
- Firma unvanının ilk kısmını soyadiUnvan, sığmazsa devamını adiUnvanDevami alanına koy.
- Bir belgede birden fazla KDV oranı varsa HER ORAN için ayrı satır üret (aynı fiş no / tarih / VKN).
- kdvOrani yalnızca 0, 1, 10 veya 20 olabilir.
- tutarKdvHaric KDV hariç matrahtır. Belgede sadece KDV dahil toplam varsa: matrah = toplam / (1 + kdvOrani/100).
- kdvSizIslem: KDV 0 ise "Var", aksi halde "Yoktur".
- Gider alt tür kodunu belgenin içeriğine göre seç:
  89 ofis (çay, kahve, temizlik malzemesi), 90 gıda/market, 95 kırtasiye, 97 kafe/restoran/iş yemeği,
  112 kısa ulaşım, 113 akaryakıt, 114 araç bakım, 189 seyahat/ulaşım, 191 otopark,
  194 dışarıdan hizmet (elektrik, su, internet, danışmanlık), 228 sarf malzeme,
  324 HGS/OGS/otoyol, 162 diğer GVK 40/1, 186 mal alışı.
- ÖKC / perakende satış fişi için aciklama: "ÖKC Fişi" + kısa satıcı adı.
- e-Arşiv / e-Fatura için aciklama: "Fatura" + fatura no veya satıcı.
- Güvenin düşükse notes alanına neyin şüpheli olduğunu yaz.
- odemeTuru, stopaj, tevkifat, sabit kıymet, finansal kiralama normal fişlerde boş bırak.

Yalnızca JSON döndür:
{
  "documentType": "okc_fisi" | "e_arsiv" | "e_fatura" | "unknown",
  "rows": [
    {
      "belgeTarihi": "YYYY-MM-DD",
      "fisNo": "",
      "tcknVkn": "",
      "soyadiUnvan": "",
      "adiUnvanDevami": "",
      "vergiDairesiKodu": "",
      "adres": "",
      "kdvOrani": 20,
      "tutarKdvHaric": 0,
      "kdvTutari": 0,
      "kdvDahilToplam": 0,
      "giderKayitTuru": "4",
      "giderKayitAltTuru": "162",
      "plakaNo": "",
      "aciklama": "",
      "confidence": 0.0,
      "notes": ""
    }
  ]
}`;

type ModelRow = {
  belgeTarihi?: string;
  fisNo?: string;
  tcknVkn?: string;
  soyadiUnvan?: string;
  adiUnvanDevami?: string;
  vergiDairesiKodu?: string;
  adres?: string;
  kdvOrani?: number | string;
  tutarKdvHaric?: number | string;
  kdvTutari?: number | string;
  kdvDahilToplam?: number | string;
  giderKayitTuru?: string;
  giderKayitAltTuru?: string | number;
  plakaNo?: string;
  aciklama?: string;
  confidence?: number;
  notes?: string;
};

type ModelResponse = {
  documentType?: string;
  rows?: ModelRow[];
};

export type UploadedInvoice = {
  filename: string;
  mimeType: string;
  bytes: Buffer;
};

function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseNumber(value: number | string | undefined): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value * 100) / 100;
  }
  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(/₺/g, "")
    .replace("TL", "")
    .replace("TRY", "");
  const compact = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : normalized;
  const parsed = Number(compact);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : null;
}

function normalizeDate(value: string | undefined) {
  if (!value) {
    return "";
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }
  const tr = /^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/.exec(value.trim());
  if (tr) {
    const day = tr[1].padStart(2, "0");
    const month = tr[2].padStart(2, "0");
    const year = tr[3].length === 2 ? `20${tr[3]}` : tr[3];
    return `${year}-${month}-${day}`;
  }
  return "";
}

function normalizeTaxId(value: string | undefined) {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) {
    return digits;
  }
  return digits;
}

function normalizeVatRate(value: number | string | undefined): number | null {
  const parsed = parseNumber(value);
  if (parsed === null) {
    return null;
  }
  const rate = parsed <= 1 && parsed > 0 && parsed !== 1 ? Math.round(parsed * 100) : parsed;
  return (KDV_ORANLARI as readonly number[]).includes(rate) ? rate : null;
}

function normalizeAltTur(value: string | number | undefined, ust: string) {
  const kod = String(value ?? "").trim();
  const match = GIDER_KAYIT_ALT_TURLERI.find((item) => item.kod === kod);
  if (match) {
    return match.kod;
  }
  const fallback = GIDER_KAYIT_ALT_TURLERI.find(
    (item) => item.ust === ust && item.kod === DEFAULT_GIDER_ALT_TURU,
  );
  return fallback?.kod ?? DEFAULT_GIDER_ALT_TURU;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function toInvoiceRows(sourceFile: string, payload: ModelResponse): InvoiceRow[] {
  const sourceRows = payload.rows?.length ? payload.rows : [{}];
  const today = todayIso();

  return sourceRows.map((row) => {
    const giderKayitTuru =
      row.giderKayitTuru === "1" ||
      row.giderKayitTuru === "4" ||
      row.giderKayitTuru === "5" ||
      row.giderKayitTuru === "13"
        ? row.giderKayitTuru
        : DEFAULT_GIDER_KAYIT_TURU;
    const kdvOrani = normalizeVatRate(row.kdvOrani);
    let tutarKdvHaric = parseNumber(row.tutarKdvHaric);
    let kdvDahilToplam = parseNumber(row.kdvDahilToplam);
    let kdvTutari = parseNumber(row.kdvTutari);

    if (tutarKdvHaric === null && kdvDahilToplam !== null && kdvOrani !== null) {
      tutarKdvHaric = round2(kdvDahilToplam / (1 + kdvOrani / 100));
    }
    if (kdvTutari === null && tutarKdvHaric !== null && kdvOrani !== null) {
      kdvTutari = round2(tutarKdvHaric * (kdvOrani / 100));
    }
    if (kdvDahilToplam === null && tutarKdvHaric !== null && kdvTutari !== null) {
      kdvDahilToplam = round2(tutarKdvHaric + kdvTutari);
    }

    const belgeTarihi = normalizeDate(row.belgeTarihi) || today;

    return {
      id: randomUUID(),
      sourceFile,
      deftereKayitTarihi: belgeTarihi,
      belgeTarihi,
      fisNo: (row.fisNo ?? "").toString().trim(),
      tcknVkn: normalizeTaxId(row.tcknVkn),
      soyadiUnvan: (row.soyadiUnvan ?? "").toString().trim(),
      adiUnvanDevami: (row.adiUnvanDevami ?? "").toString().trim(),
      vergiDairesi: (row.vergiDairesiKodu ?? "").toString().trim(),
      adres: (row.adres ?? "").toString().trim(),
      alisTuru: DEFAULT_ALIS_TURU,
      giderKayitTuru,
      giderKayitAltTuru: normalizeAltTur(row.giderKayitAltTuru, giderKayitTuru),
      kdvSizIslem: kdvOrani === 0 ? "Var" : "Yoktur",
      kdvOrani,
      faaliyetKodu: "",
      tutarKdvHaric,
      kdvTutari,
      kdvDahilToplam,
      gercekDeger: kdvDahilToplam === null ? "" : String(kdvDahilToplam),
      donemsellikIlkesi: "Yoktur",
      stopaj: "",
      stopajTutari: null,
      kdvTevkifati: kdvTutari === null ? "" : String(kdvTutari),
      sorumluKdv: "",
      kdvTevkifatMatrah: null,
      sabitKiymetKodu: "",
      sabitKiymetAdi: "",
      plakaNo: (row.plakaNo ?? "").toString().trim().toUpperCase(),
      finansalKiralama: "",
      odemeTuru: "",
      aciklama: (row.aciklama ?? "").toString().trim() || "ÖKC Fişi",
      confidence: typeof row.confidence === "number" ? row.confidence : 0.5,
      notes: (row.notes ?? "").toString().trim(),
    };
  });
}

function parseJsonPayload(text: string): ModelResponse {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : trimmed;
  return JSON.parse(raw) as ModelResponse;
}

function geminiErrorMessage(status: number, body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } };
    if (parsed.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // keep fallback
  }
  return body.slice(0, 180) || `HTTP ${status}`;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function extractWithGemini(file: UploadedInvoice): Promise<InvoiceRow[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY tanımlı değil.");
  }

  const models = [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash",
    "gemini-2.5-flash-lite",
  ].filter(
    (model, index, list): model is string =>
      Boolean(model) && list.indexOf(model) === index,
  );

  let lastError = "Gemini yanıt vermedi.";

  for (const model of models) {
    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: EXTRACT_PROMPT },
                  {
                    inlineData: {
                      mimeType: file.mimeType,
                      data: file.bytes.toString("base64"),
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
          signal: AbortSignal.timeout(25000),
        },
      );
    } catch {
      lastError = `Gemini (${model}) zaman aşımı veya bağlantı hatası.`;
      continue;
    }

    const raw = await response.text();

    if (response.status === 503 || response.status === 429) {
      lastError = `Gemini (${model}): ${geminiErrorMessage(response.status, raw)}`;
      await sleep(800);
      continue;
    }

    if (!response.ok) {
      lastError = `Gemini (${model}): ${geminiErrorMessage(response.status, raw)}`;
      continue;
    }

    const data = JSON.parse(raw) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    if (!text) {
      lastError = `Gemini (${model}) boş yanıt döndü.`;
      continue;
    }

    return toInvoiceRows(file.filename, parseJsonPayload(text));
  }

  throw new Error(lastError);
}

async function extractWithOpenAI(file: UploadedInvoice): Promise<InvoiceRow[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY tanımlı değil.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL || "gpt-4o",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: EXTRACT_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.mimeType};base64,${file.bytes.toString("base64")}`,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text) {
    throw new Error("OpenAI boş yanıt döndü.");
  }

  return toInvoiceRows(file.filename, parseJsonPayload(text));
}

export async function extractInvoiceRows(file: UploadedInvoice): Promise<InvoiceRow[]> {
  const isPdf = file.mimeType === "application/pdf";
  if (process.env.GEMINI_API_KEY) {
    return extractWithGemini(file);
  }
  if (process.env.OPENAI_API_KEY) {
    if (isPdf) {
      throw new Error("PDF okuma için GEMINI_API_KEY gerekir.");
    }
    return extractWithOpenAI(file);
  }
  throw new Error("Görüntü okuma için GEMINI_API_KEY veya OPENAI_API_KEY tanımlayın.");
}

export async function extractInvoiceBatch(files: UploadedInvoice[]) {
  const results: InvoiceRow[] = [];
  const errors: Array<{ filename: string; message: string }> = [];
  let index = 0;
  const concurrency = Math.min(2, files.length);

  async function worker() {
    while (index < files.length) {
      const current = files[index++];
      try {
        const rows = await extractInvoiceRows(current);
        results.push(...rows);
      } catch (error) {
        errors.push({
          filename: current.filename,
          message: error instanceof Error ? error.message : "Okuma başarısız.",
        });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return { rows: results, errors };
}

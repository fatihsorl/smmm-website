import ExcelJS from "exceljs";

export type ParsedRow = {
  rowNo: number;
  cells: string[];
};

export type ParsedSheet = {
  filename: string;
  columnCount: number;
  rows: ParsedRow[];
};

export type CompareResult = {
  matchField: string;
  summary: string;
  headerA: string[];
  headerB: string[];
  onlyInA: ParsedRow[];
  onlyInB: ParsedRow[];
  mismatches: Array<{ rowA: ParsedRow; rowB: ParsedRow; note: string }>;
  truncated: boolean;
};

const MAX_ROWS_PER_FILE = 6000;
const MAX_PROMPT_CHARS = 900_000;

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "object") {
    const withResult = value as { result?: ExcelJS.CellValue; text?: string; richText?: Array<{ text: string }> };
    if (withResult.richText) {
      return withResult.richText.map((part) => part.text).join("");
    }
    if (withResult.result !== undefined) {
      return cellText(withResult.result);
    }
    if (withResult.text !== undefined) {
      return String(withResult.text);
    }
    return "";
  }
  return String(value).trim();
}

export async function parseWorkbookForCompare(
  buffer: Buffer,
  filename: string,
): Promise<ParsedSheet> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) {
    throw new Error(`${filename} içinde okunabilir bir sayfa bulunamadı.`);
  }

  const rows: ParsedRow[] = [];
  let columnCount = 0;
  sheet.eachRow({ includeEmpty: false }, (row, rowNo) => {
    const values = row.values as ExcelJS.CellValue[];
    const cells = values.slice(1).map((value) => cellText(value));
    while (cells.length && !cells[cells.length - 1]) {
      cells.pop();
    }
    if (cells.length === 0) {
      return;
    }
    columnCount = Math.max(columnCount, cells.length);
    rows.push({ rowNo, cells });
  });

  if (rows.length === 0) {
    throw new Error(`${filename} boş görünüyor.`);
  }

  return { filename, columnCount, rows };
}

function buildSheetBlock(label: string, sheet: ParsedSheet, maxRows: number) {
  const limited = sheet.rows.slice(0, maxRows);
  const truncated = sheet.rows.length > limited.length;
  const lines = limited.map((row) => `#${row.rowNo}: ${row.cells.join(" | ")}`);
  return {
    text: `${label} (dosya adı: ${sheet.filename}, toplam ${sheet.rows.length} satır${truncated ? `, ilk ${limited.length} satır gösteriliyor` : ""}):\n${lines.join("\n")}`,
    truncated,
  };
}

const COMPARE_PROMPT_HEADER = `Sen bir mali müşavir asistanısın. İki ayrı Excel dosyasından çıkarılmış ham satırları karşılaştıracaksın.
Her satırın başındaki "#N" o satırın Excel dosyasındaki GERÇEK satır numarasıdır. Cevabında sadece bu numaraları kullan, satır içeriğini yeniden yazma.

Görevin:
1. Her iki dosyada da satırları benzersiz şekilde eşleştirebileceğin bir alan bul (fatura/fiş/belge numarası, sipariş no, referans kodu, VKN+tarih+tutar kombinasyonu gibi). Başlık satırlarını ve boş/etiket satırlarını (dosya başlığı, tarih aralığı gibi) yok say.
2. Bu alana göre A dosyasındaki satırları B dosyasındaki satırlarla eşleştir.
3. A'da olup B'de KARŞILIĞI OLMAYAN satırların numaralarını (onlyInA), B'de olup A'da KARŞILIĞI OLMAYAN satırların numaralarını (onlyInB) bul.
4. Eşleşen ama tutar/miktar gibi kritik bir değeri FARKLI olan satır çiftlerini mismatches olarak bul (rowA, rowB, ve farkı kısaca açıklayan not).
5. Başlık satırının hangi satır numarası olduğunu headerRowA / headerRowB olarak belirt (yoksa null).
6. Kısa, Türkçe bir özet yaz: kaç satır eşleşti, kaç fark bulundu, genel gözlemler.

Sadece şu JSON'u döndür, başka hiçbir şey yazma:
{
  "matchField": "neye göre eşleştirdiğini kısaca açıkla",
  "headerRowA": 4,
  "headerRowB": 6,
  "onlyInA": [12, 45],
  "onlyInB": [8],
  "mismatches": [{"rowA": 20, "rowB": 33, "note": "tutar 100 TL farklı"}],
  "summary": "kısa özet"
}`;

type ModelCompareResponse = {
  matchField?: string;
  headerRowA?: number | null;
  headerRowB?: number | null;
  onlyInA?: number[];
  onlyInB?: number[];
  mismatches?: Array<{ rowA: number; rowB: number; note?: string }>;
  summary?: string;
};

function parseJsonPayload(text: string): ModelCompareResponse {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : trimmed).trim();
  try {
    return JSON.parse(raw) as ModelCompareResponse;
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(raw.slice(start, end + 1)) as ModelCompareResponse;
    }
    throw new Error("Model geçersiz JSON döndü.");
  }
}

function candidateText(raw: string) {
  const data = JSON.parse(raw) as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const candidate = data.candidates?.[0];
  const text =
    candidate?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
  return { text, finishReason: candidate?.finishReason ?? "" };
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

async function askGeminiToCompare(prompt: string): Promise<ModelCompareResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY tanımlı değil.");
  }

  const envModel = process.env.GEMINI_MODEL?.trim();
  const staleModel = envModel && /1\.5|2\.0|2\.5/.test(envModel);
  const models = [
    staleModel ? undefined : envModel,
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
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
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
          signal: AbortSignal.timeout(50_000),
        },
      );
    } catch {
      lastError = `Gemini (${model}) zaman aşımı veya bağlantı hatası.`;
      await sleep(500);
      continue;
    }

    const raw = await response.text();

    if (response.status === 503 || response.status === 429) {
      lastError = `Gemini (${model}): ${geminiErrorMessage(response.status, raw)}`;
      await sleep(600);
      continue;
    }

    if (!response.ok) {
      lastError = `Gemini (${model}): ${geminiErrorMessage(response.status, raw)}`;
      continue;
    }

    try {
      const { text, finishReason } = candidateText(raw);
      if (!text) {
        lastError = `Gemini (${model}) boş yanıt${finishReason ? ` (${finishReason})` : ""}.`;
        continue;
      }
      return parseJsonPayload(text);
    } catch (error) {
      lastError =
        error instanceof Error
          ? `Gemini (${model}): ${error.message}`
          : `Gemini (${model}) yanıtı işlenemedi.`;
    }
  }

  throw new Error(lastError);
}

function findRow(sheet: ParsedSheet, rowNo: number): ParsedRow | undefined {
  return sheet.rows.find((row) => row.rowNo === rowNo);
}

export async function compareInvoiceSheets(
  sheetA: ParsedSheet,
  sheetB: ParsedSheet,
): Promise<CompareResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Karşılaştırma için GEMINI_API_KEY tanımlayın.");
  }

  const maxRowsA = Math.min(MAX_ROWS_PER_FILE, sheetA.rows.length);
  const maxRowsB = Math.min(MAX_ROWS_PER_FILE, sheetB.rows.length);
  const blockA = buildSheetBlock("DOSYA A", sheetA, maxRowsA);
  const blockB = buildSheetBlock("DOSYA B", sheetB, maxRowsB);

  const prompt = `${COMPARE_PROMPT_HEADER}\n\n${blockA.text}\n\n${blockB.text}`;
  const truncated = blockA.truncated || blockB.truncated;

  if (prompt.length > MAX_PROMPT_CHARS) {
    throw new Error(
      "Dosyalar AI karşılaştırması için çok büyük. Daha az satırlı dosyalarla tekrar deneyin.",
    );
  }

  const modelResponse = await askGeminiToCompare(prompt);

  const validRowsA = new Set(sheetA.rows.map((row) => row.rowNo));
  const validRowsB = new Set(sheetB.rows.map((row) => row.rowNo));

  const onlyInA = (modelResponse.onlyInA ?? [])
    .filter((rowNo) => validRowsA.has(rowNo))
    .map((rowNo) => findRow(sheetA, rowNo))
    .filter((row): row is ParsedRow => Boolean(row));

  const onlyInB = (modelResponse.onlyInB ?? [])
    .filter((rowNo) => validRowsB.has(rowNo))
    .map((rowNo) => findRow(sheetB, rowNo))
    .filter((row): row is ParsedRow => Boolean(row));

  const mismatches = (modelResponse.mismatches ?? [])
    .map((item) => {
      const rowA = findRow(sheetA, item.rowA);
      const rowB = findRow(sheetB, item.rowB);
      if (!rowA || !rowB) {
        return null;
      }
      return { rowA, rowB, note: (item.note ?? "").trim() };
    })
    .filter((item): item is { rowA: ParsedRow; rowB: ParsedRow; note: string } => Boolean(item));

  const headerA =
    (typeof modelResponse.headerRowA === "number"
      ? findRow(sheetA, modelResponse.headerRowA)?.cells
      : undefined) ?? [];
  const headerB =
    (typeof modelResponse.headerRowB === "number"
      ? findRow(sheetB, modelResponse.headerRowB)?.cells
      : undefined) ?? [];

  return {
    matchField: (modelResponse.matchField ?? "").trim(),
    summary: (modelResponse.summary ?? "").trim(),
    headerA,
    headerB,
    onlyInA,
    onlyInB,
    mismatches,
    truncated,
  };
}

export function buildCompareWorkbook(result: CompareResult) {
  const workbook = new ExcelJS.Workbook();

  const summarySheet = workbook.addWorksheet("Özet");
  summarySheet.columns = [{ width: 28 }, { width: 90 }];
  summarySheet.addRow(["Eşleştirme kriteri", result.matchField || "—"]);
  summarySheet.addRow(["A'da olup B'de olmayan", result.onlyInA.length]);
  summarySheet.addRow(["B'de olup A'da olmayan", result.onlyInB.length]);
  summarySheet.addRow(["Uyuşmayan satır çifti", result.mismatches.length]);
  summarySheet.addRow([]);
  summarySheet.addRow(["Özet", result.summary || "—"]);
  summarySheet.getColumn(1).font = { bold: true };

  function headerRow(fallbackCount: number, header: string[]) {
    if (header.length) {
      return ["Excel satırı", ...header];
    }
    return ["Excel satırı", ...Array.from({ length: fallbackCount }, (_, i) => `Sütun ${i + 1}`)];
  }

  const sheetA = workbook.addWorksheet("A'da olup B'de yok");
  const colCountA = Math.max(result.headerA.length, ...result.onlyInA.map((r) => r.cells.length), 1);
  sheetA.addRow(headerRow(colCountA, result.headerA));
  sheetA.getRow(1).font = { bold: true };
  result.onlyInA.forEach((row) => sheetA.addRow([row.rowNo, ...row.cells]));
  sheetA.columns.forEach((col) => (col.width = 18));

  const sheetB = workbook.addWorksheet("B'de olup A'da yok");
  const colCountB = Math.max(result.headerB.length, ...result.onlyInB.map((r) => r.cells.length), 1);
  sheetB.addRow(headerRow(colCountB, result.headerB));
  sheetB.getRow(1).font = { bold: true };
  result.onlyInB.forEach((row) => sheetB.addRow([row.rowNo, ...row.cells]));
  sheetB.columns.forEach((col) => (col.width = 18));

  const sheetM = workbook.addWorksheet("Uyuşmazlık");
  sheetM.addRow(["A satırı", "A içeriği", "B satırı", "B içeriği", "Not"]);
  sheetM.getRow(1).font = { bold: true };
  result.mismatches.forEach((item) =>
    sheetM.addRow([
      item.rowA.rowNo,
      item.rowA.cells.join(" | "),
      item.rowB.rowNo,
      item.rowB.cells.join(" | "),
      item.note,
    ]),
  );
  sheetM.columns = [{ width: 10 }, { width: 55 }, { width: 10 }, { width: 55 }, { width: 40 }];

  return workbook;
}

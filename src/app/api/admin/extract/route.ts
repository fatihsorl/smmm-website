import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import { extractInvoiceBatch, type UploadedInvoice } from "@/lib/invoice-extract";

export const runtime = "nodejs";
export const maxDuration = 120;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const MAX_FILES = 20;
const MAX_FILE_BYTES = 12 * 1024 * 1024;

function mimeFromName(filename: string, fallback: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "heic") return "image/heic";
  if (ext === "heif") return "image/heif";
  return fallback;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }

  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files");
  if (files.length === 0) {
    return NextResponse.json({ message: "Fatura görseli yükleyin." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { message: `En fazla ${MAX_FILES} görsel yükleyebilirsiniz.` },
      { status: 400 },
    );
  }

  const uploaded: UploadedInvoice[] = [];

  for (const entry of files) {
    if (!(entry instanceof File)) {
      continue;
    }
    const mimeType = mimeFromName(entry.name, entry.type);
    if (!ALLOWED_TYPES.has(mimeType)) {
      return NextResponse.json(
        { message: `${entry.name} desteklenmiyor. JPG, PNG, WEBP veya HEIC kullanın.` },
        { status: 400 },
      );
    }
    if (entry.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { message: `${entry.name} çok büyük. Görselleri 12 MB altında tutun.` },
        { status: 400 },
      );
    }
    uploaded.push({
      filename: entry.name,
      mimeType: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
      bytes: Buffer.from(await entry.arrayBuffer()),
    });
  }

  if (uploaded.length === 0) {
    return NextResponse.json({ message: "Geçerli görsel bulunamadı." }, { status: 400 });
  }

  try {
    const result = await extractInvoiceBatch(uploaded);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Invoice extract error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Faturalar okunamadı." },
      { status: 500 },
    );
  }
}

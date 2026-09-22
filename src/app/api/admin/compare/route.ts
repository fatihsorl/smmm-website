import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import { compareInvoiceSheets, parseWorkbookForCompare } from "@/lib/invoice-compare";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const ALLOWED_EXTENSIONS = /\.(xlsx|xlsm|xls)$/i;

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }

  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const formData = await request.formData();
  const fileA = formData.get("fileA");
  const fileB = formData.get("fileB");

  if (!(fileA instanceof File) || !(fileB instanceof File)) {
    return NextResponse.json({ message: "İki Excel dosyası da gerekli." }, { status: 400 });
  }

  for (const file of [fileA, fileB]) {
    if (!ALLOWED_EXTENSIONS.test(file.name)) {
      return NextResponse.json(
        { message: `${file.name} bir Excel dosyası değil (.xlsx/.xls bekleniyor).` },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { message: `${file.name} çok büyük. Dosyayı 15 MB altında tutun.` },
        { status: 400 },
      );
    }
  }

  try {
    const [sheetA, sheetB] = await Promise.all([
      parseWorkbookForCompare(Buffer.from(await fileA.arrayBuffer()), fileA.name),
      parseWorkbookForCompare(Buffer.from(await fileB.arrayBuffer()), fileB.name),
    ]);

    const result = await compareInvoiceSheets(sheetA, sheetB);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Invoice compare error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Karşılaştırma başarısız." },
      { status: 500 },
    );
  }
}

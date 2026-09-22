import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import { buildCompareWorkbook, type CompareResult } from "@/lib/invoice-compare";

export const runtime = "nodejs";

function stamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 403 });
  }

  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Oturum gerekli." }, { status: 401 });
  }

  const body = (await request.json()) as { result?: CompareResult };
  if (!body.result) {
    return NextResponse.json({ message: "Aktarılacak karşılaştırma sonucu yok." }, { status: 400 });
  }

  try {
    const workbook = buildCompareWorkbook(body.result);
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Fatura_Karsilastirma_${stamp()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Compare export error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Excel oluşturulamadı." },
      { status: 500 },
    );
  }
}

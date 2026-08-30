import { NextResponse } from "next/server";
import { isAdminRequest, isAllowedOrigin } from "@/lib/admin-auth";
import type { InvoiceRow } from "@/lib/invoice-types";
import { buildOkcWorkbook } from "@/lib/okc-excel";

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

  const body = (await request.json()) as { rows?: InvoiceRow[] };
  const rows = body.rows ?? [];
  if (rows.length === 0) {
    return NextResponse.json({ message: "Aktarılacak satır yok." }, { status: 400 });
  }

  try {
    const buffer = await buildOkcWorkbook(rows);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="OKC_Gider_${stamp()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("OKC excel export error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Excel oluşturulamadı." },
      { status: 500 },
    );
  }
}

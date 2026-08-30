import { readFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import type { InvoiceRow } from "@/lib/invoice-types";

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "src/data/templates/Isletme_OKCFisi_Gider.xlsx",
);

function toExcelSerial(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const epoch = Date.UTC(1899, 11, 30);
  return Math.round((utc - epoch) / 86_400_000);
}

function emptyToBlank(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return value;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function vatAmount(row: InvoiceRow) {
  if (row.kdvTutari !== null && row.kdvTutari !== undefined) {
    return row.kdvTutari;
  }
  if (row.tutarKdvHaric !== null && row.kdvOrani !== null) {
    return round2(row.tutarKdvHaric * (row.kdvOrani / 100));
  }
  return null;
}

function receiptTotal(row: InvoiceRow) {
  if (row.kdvDahilToplam !== null && row.kdvDahilToplam !== undefined) {
    return row.kdvDahilToplam;
  }
  const vat = vatAmount(row);
  if (row.tutarKdvHaric !== null && vat !== null) {
    return round2(row.tutarKdvHaric + vat);
  }
  const parsed = Number(String(row.gercekDeger).replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function buildOkcWorkbook(rows: InvoiceRow[]) {
  const workbook = new ExcelJS.Workbook();
  const template = await readFile(TEMPLATE_PATH);
  await workbook.xlsx.load(template as unknown as ArrayBuffer);

  const sheet = workbook.getWorksheet("Örnek Excel Şablonu");
  if (!sheet) {
    throw new Error("GİB şablonunda 'Örnek Excel Şablonu' sayfası bulunamadı.");
  }

  const sampleEnd = Math.max(sheet.rowCount, 13);
  const styleSource = sheet.getRow(2);

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const excelRow = sheet.getRow(index + 2);

    styleSource.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      excelRow.getCell(colNumber).style = { ...cell.style };
    });

    excelRow.getCell(1).value = toExcelSerial(row.deftereKayitTarihi);
    excelRow.getCell(1).numFmt = "DD.MM.YYYY";
    excelRow.getCell(2).value = toExcelSerial(row.belgeTarihi);
    excelRow.getCell(2).numFmt = "DD.MM.YYYY";
    excelRow.getCell(3).value = emptyToBlank(row.fisNo);
    excelRow.getCell(4).value = emptyToBlank(row.tcknVkn);
    excelRow.getCell(5).value = emptyToBlank(row.soyadiUnvan);
    excelRow.getCell(6).value = emptyToBlank(row.adiUnvanDevami);
    excelRow.getCell(7).value = emptyToBlank(row.vergiDairesi);
    excelRow.getCell(8).value = emptyToBlank(row.adres);
    excelRow.getCell(9).value = emptyToBlank(row.alisTuru);
    excelRow.getCell(10).value = emptyToBlank(row.giderKayitTuru);
    excelRow.getCell(11).value = emptyToBlank(row.giderKayitAltTuru);
    excelRow.getCell(12).value = emptyToBlank(row.kdvSizIslem || "Yoktur");
    excelRow.getCell(13).value = row.kdvOrani;
    excelRow.getCell(14).value = emptyToBlank(row.faaliyetKodu);
    excelRow.getCell(15).value = row.tutarKdvHaric;
    excelRow.getCell(15).numFmt = "#,##0.00";
    excelRow.getCell(16).value = receiptTotal(row);
    excelRow.getCell(16).numFmt = "#,##0.00";
    excelRow.getCell(17).value = emptyToBlank(row.donemsellikIlkesi || "Yoktur");
    excelRow.getCell(18).value = emptyToBlank(row.stopaj);
    excelRow.getCell(19).value = row.stopajTutari;
    excelRow.getCell(20).value = vatAmount(row);
    excelRow.getCell(20).numFmt = "#,##0.00";
    excelRow.getCell(21).value = emptyToBlank(row.sorumluKdv);
    excelRow.getCell(22).value = row.kdvTevkifatMatrah;
    excelRow.getCell(23).value = emptyToBlank(row.sabitKiymetKodu);
    excelRow.getCell(24).value = emptyToBlank(row.sabitKiymetAdi);
    excelRow.getCell(25).value = emptyToBlank(row.plakaNo);
    excelRow.getCell(26).value = emptyToBlank(row.finansalKiralama);
    excelRow.getCell(27).value = emptyToBlank(row.odemeTuru);
    excelRow.getCell(28).value = emptyToBlank(row.aciklama);
    excelRow.commit();
  }

  const firstUnused = rows.length + 2;
  for (let r = firstUnused; r <= sampleEnd; r += 1) {
    const leftover = sheet.getRow(r);
    for (let col = 1; col <= 28; col += 1) {
      leftover.getCell(col).value = null;
    }
  }
  if (sampleEnd >= firstUnused) {
    sheet.spliceRows(firstUnused, sampleEnd - firstUnused + 1);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

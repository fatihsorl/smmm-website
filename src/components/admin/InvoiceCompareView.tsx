"use client";

import { useRef, useState } from "react";
import type { CompareResult } from "@/lib/invoice-compare";

function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}

type PickedFile = { file: File } | null;

function FileSlot({
  label,
  hint,
  picked,
  onPick,
  onClear,
}: {
  label: string;
  hint: string;
  picked: PickedFile;
  onPick: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-800">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.xlsm"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onPick(file);
          }
          event.target.value = "";
        }}
      />
      {picked ? (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <p className="truncate text-sm text-slate-700">{picked.file.name}</p>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs font-medium text-red-600 hover:underline"
          >
            Kaldır
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 w-full rounded-xl bg-[#21579f] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1a4785]"
        >
          Excel seç
        </button>
      )}
    </div>
  );
}

function DiffTable({ header, rows }: { header: string[]; rows: Array<{ rowNo: number; cells: string[] }> }) {
  if (rows.length === 0) {
    return <p className="px-4 py-6 text-sm text-slate-500">Fark bulunamadı.</p>;
  }
  const colCount = Math.max(header.length, ...rows.map((r) => r.cells.length));
  const columns = header.length
    ? header
    : Array.from({ length: colCount }, (_, i) => `Sütun ${i + 1}`);

  return (
    <div className="max-h-[65vh] overflow-auto">
      <table className="w-full min-w-[600px] table-auto text-left text-sm">
        <thead className="sticky top-0 z-10 bg-[#0f2a4d] text-white">
          <tr>
            <th className="whitespace-nowrap px-3 py-2 font-medium">Excel satırı</th>
            {columns.map((col, i) => (
              <th key={i} className="whitespace-nowrap px-3 py-2 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rowNo} className="border-t border-slate-100 even:bg-slate-50/60">
              <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-500">
                {row.rowNo}
              </td>
              {columns.map((_, i) => (
                <td key={i} className="whitespace-nowrap px-3 py-2 text-slate-700">
                  {row.cells[i] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ResultTab = "onlyInA" | "onlyInB" | "mismatches";

async function readApiJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Sunucu beklenmeyen yanıt verdi.");
  }
}

export default function InvoiceCompareView() {
  const [fileA, setFileA] = useState<PickedFile>(null);
  const [fileB, setFileB] = useState<PickedFile>(null);
  const [comparing, setComparing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"info" | "ok" | "err">("info");
  const [activeTab, setActiveTab] = useState<ResultTab>("onlyInA");

  async function handleCompare() {
    if (!fileA || !fileB) {
      setStatusTone("err");
      setStatus("Karşılaştırmak için iki Excel dosyası da seçin.");
      return;
    }
    setComparing(true);
    setStatusTone("info");
    setStatus("Dosyalar okunuyor ve yapay zeka ile karşılaştırılıyor...");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("fileA", fileA.file);
      formData.append("fileB", fileB.file);
      const response = await fetch("/api/admin/compare", { method: "POST", body: formData });
      const data = await readApiJson<CompareResult & { message?: string }>(response);
      if (!response.ok) {
        throw new Error(data.message ?? "Karşılaştırma başarısız.");
      }
      setResult(data);
      setActiveTab("onlyInA");
      setStatusTone("ok");
      setStatus(
        `Karşılaştırma tamam: ${data.onlyInA.length} satır A'da olup B'de yok, ${data.onlyInB.length} satır B'de olup A'da yok, ${data.mismatches.length} satırda uyuşmazlık var.`,
      );
    } catch (error) {
      setStatusTone("err");
      setStatus(error instanceof Error ? error.message : "Karşılaştırma sırasında hata oluştu.");
    } finally {
      setComparing(false);
    }
  }

  async function handleExport() {
    if (!result) {
      return;
    }
    setExporting(true);
    setStatusTone("info");
    setStatus("Excel hazırlanıyor...");
    try {
      const response = await fetch("/api/admin/compare/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? "Excel oluşturulamadı.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stampDate = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `Fatura_Karsilastirma_${stampDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatusTone("ok");
      setStatus("Excel indirildi.");
    } catch (error) {
      setStatusTone("err");
      setStatus(error instanceof Error ? error.message : "Excel indirme hatası.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 mt-6">
        <h1 className="text-2xl font-semibold tracking-tight">Fatura karşılaştır</h1>
        <p className="mt-1 text-sm text-slate-500">
          İki Excel dosyasını yükleyin, yapay zeka aralarındaki farkları bulsun ve indirilebilir bir
          rapor oluştursun.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <FileSlot
          label="1. Excel (Dosya A)"
          hint="Örn. satış / fatura listesi"
          picked={fileA}
          onPick={(file) => setFileA({ file })}
          onClear={() => setFileA(null)}
        />
        <FileSlot
          label="2. Excel (Dosya B)"
          hint="Örn. muavin defter"
          picked={fileB}
          onPick={(file) => setFileB({ file })}
          onClear={() => setFileB(null)}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleCompare()}
          disabled={comparing || !fileA || !fileB}
          className="inline-flex items-center gap-2 rounded-xl bg-[#21579f] px-5 py-2.5 font-medium text-white shadow-md shadow-[#21579f]/20 hover:bg-[#1a4785] disabled:opacity-50"
        >
          {comparing ? <Spinner /> : null}
          {comparing ? "Karşılaştırılıyor" : "Karşılaştır"}
        </button>
        {result ? (
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl border border-[#21579f] px-5 py-2.5 font-medium text-[#21579f] hover:bg-[#21579f]/5 disabled:opacity-50"
          >
            {exporting ? <Spinner className="h-5 w-5" /> : null}
            {exporting ? "Hazırlanıyor" : "Sonucu Excel olarak indir"}
          </button>
        ) : null}
      </div>

      {status ? (
        <p
          className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
            statusTone === "ok"
              ? "bg-emerald-50 text-emerald-800"
              : statusTone === "err"
                ? "bg-red-50 text-red-700"
                : "bg-sky-50 text-sky-900"
          }`}
        >
          {status}
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-6">
          {result.matchField ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-medium">Eşleştirme kriteri: </span>
              {result.matchField}
            </p>
          ) : null}
          {result.summary ? (
            <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">{result.summary}</p>
          ) : null}
          {result.truncated ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Dosyalardan biri çok satırlı olduğu için karşılaştırma yalnızca ilk satırlar üzerinden
              yapıldı.
            </p>
          ) : null}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
              {(
                [
                  ["onlyInA", `A'da olup B'de olmayan (${result.onlyInA.length})`],
                  ["onlyInB", `B'de olup A'da olmayan (${result.onlyInB.length})`],
                  ["mismatches", `Uyuşmazlık (${result.mismatches.length})`],
                ] as Array<[ResultTab, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    activeTab === key
                      ? "bg-[#21579f] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "onlyInA" ? <DiffTable header={result.headerA} rows={result.onlyInA} /> : null}
            {activeTab === "onlyInB" ? <DiffTable header={result.headerB} rows={result.onlyInB} /> : null}
            {activeTab === "mismatches" ? (
              result.mismatches.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-500">Uyuşmazlık bulunamadı.</p>
              ) : (
                <div className="max-h-[65vh] overflow-auto">
                  <table className="w-full min-w-[700px] table-auto text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-[#0f2a4d] text-white">
                      <tr>
                        <th className="whitespace-nowrap px-3 py-2 font-medium">A satırı</th>
                        <th className="whitespace-nowrap px-3 py-2 font-medium">A içeriği</th>
                        <th className="whitespace-nowrap px-3 py-2 font-medium">B satırı</th>
                        <th className="whitespace-nowrap px-3 py-2 font-medium">B içeriği</th>
                        <th className="whitespace-nowrap px-3 py-2 font-medium">Not</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.mismatches.map((item, index) => (
                        <tr key={index} className="border-t border-slate-100 even:bg-slate-50/60">
                          <td className="px-3 py-2 text-slate-500">{item.rowA.rowNo}</td>
                          <td className="px-3 py-2 text-slate-700">{item.rowA.cells.join(" · ")}</td>
                          <td className="px-3 py-2 text-slate-500">{item.rowB.rowNo}</td>
                          <td className="px-3 py-2 text-slate-700">{item.rowB.cells.join(" · ")}</td>
                          <td className="px-3 py-2 text-slate-700">{item.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

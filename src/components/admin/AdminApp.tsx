"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GIDER_KAYIT_ALT_TURLERI,
  GIDER_KAYIT_TURLERI,
  KDV_ORANLARI,
} from "@/data/okc-lookups";
import type { InvoiceRow } from "@/lib/invoice-types";

type SessionState = {
  authenticated: boolean;
  configured: boolean;
  visionReady: boolean;
};

type LocalFile = {
  id: string;
  file: File;
  previewUrl: string;
};

const money = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
      />
    </svg>
  );
}

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="h-10 w-auto" />
      <div>
        <p
          className={`text-sm font-semibold tracking-wide ${light ? "text-white" : "text-[#21579f]"}`}
        >
          Soral Danışmanlık
        </p>
        <p className={`text-xs ${light ? "text-white/70" : "text-slate-500"}`}>
          ÖKC fiş paneli
        </p>
      </div>
    </div>
  );
}

async function compressImage(file: File) {
  if (
    !file.type.startsWith("image/") ||
    file.type.includes("heic") ||
    file.type.includes("heif")
  ) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.82),
  );
  if (!blob) {
    return file;
  }
  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

function syncAmounts(row: InvoiceRow): InvoiceRow {
  if (row.tutarKdvHaric === null || row.kdvOrani === null) {
    return row;
  }
  const kdvTutari = Math.round(row.tutarKdvHaric * row.kdvOrani) / 100;
  const kdvDahilToplam =
    Math.round((row.tutarKdvHaric + kdvTutari) * 100) / 100;
  return {
    ...row,
    kdvTutari,
    kdvDahilToplam,
    gercekDeger: String(kdvDahilToplam),
    kdvTevkifati: String(kdvTutari),
    kdvSizIslem: row.kdvOrani === 0 ? "Var" : "Yoktur",
  };
}

export default function AdminApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<SessionState | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [extractLabel, setExtractLabel] = useState("Faturalar okunuyor");
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"info" | "ok" | "err">("info");
  const [dragOver, setDragOver] = useState(false);

  const refreshSession = useCallback(async () => {
    const response = await fetch("/api/admin/session", { cache: "no-store" });
    const data = (await response.json()) as SessionState;
    setSession(data);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [files]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.net += row.tutarKdvHaric ?? 0;
        acc.vat += row.kdvTutari ?? 0;
        acc.gross += row.kdvDahilToplam ?? 0;
        return acc;
      },
      { net: 0, vat: 0, gross: 0 },
    );
  }, [rows]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setAuthError(data.message ?? "Giriş başarısız.");
        return;
      }
      setPassword("");
      await refreshSession();
    } catch {
      setAuthError("Bağlantı hatası.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setFiles([]);
    setRows([]);
    setStatus("");
    await refreshSession();
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter(
      (file) =>
        file.type.startsWith("image/") ||
        /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name),
    );
    setFiles((current) => {
      const next = [...current];
      for (const file of incoming) {
        if (
          next.some(
            (item) =>
              item.file.name === file.name && item.file.size === file.size,
          )
        ) {
          continue;
        }
        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
      return next.slice(0, 20);
    });
  }

  function removeFile(id: string) {
    setFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  async function handleExtract() {
    if (files.length === 0) {
      setStatusTone("err");
      setStatus("Önce fatura görselleri ekleyin.");
      return;
    }

    setExtracting(true);
    setExtractLabel("Görseller hazırlanıyor");
    setStatusTone("info");
    setStatus("Faturalar okunuyor...");
    try {
      const formData = new FormData();
      for (const item of files) {
        formData.append("files", await compressImage(item.file));
      }
      setExtractLabel("Yapay zeka fişleri okuyor");

      const response = await fetch("/api/admin/extract", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        rows?: InvoiceRow[];
        errors?: Array<{ filename: string; message: string }>;
        message?: string;
      };

      if (!response.ok) {
        setStatusTone("err");
        setStatus(data.message ?? "Okuma başarısız.");
        return;
      }

      setRows(data.rows ?? []);
      if (data.errors?.length) {
        setStatusTone("err");
        setStatus(
          `${data.rows?.length ?? 0} satır okundu. ${data.errors.length} görsel hata verdi: ${data.errors
            .map((item) => item.filename)
            .join(", ")}`,
        );
      } else {
        setStatusTone("ok");
        setStatus(
          `${data.rows?.length ?? 0} satır hazır. İndirmeden önce kontrol edin.`,
        );
      }
    } catch {
      setStatusTone("err");
      setStatus("Okuma sırasında bağlantı hatası oluştu.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleExport() {
    if (rows.length === 0) {
      setStatusTone("err");
      setStatus("İndirilecek satır yok.");
      return;
    }

    setExporting(true);
    setStatusTone("info");
    setStatus("Excel hazırlanıyor...");
    try {
      const response = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setStatusTone("err");
        setStatus(data.message ?? "Excel oluşturulamadı.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `OKC_Gider_${stamp}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatusTone("ok");
      setStatus("Excel indirildi.");
    } catch {
      setStatusTone("err");
      setStatus("Excel indirme hatası.");
    } finally {
      setExporting(false);
    }
  }

  function updateRow(id: string, patch: Partial<InvoiceRow>) {
    setRows((current) =>
      current.map((row) =>
        row.id === id ? syncAmounts({ ...row, ...patch }) : row,
      ),
    );
  }

  function removeRow(id: string) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#21579f] focus:ring-2 focus:ring-[#21579f]/20";

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0f2a4d] text-white">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-white/80">Panel hazırlanıyor...</p>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="flex min-h-screen">
        <aside className="relative hidden h-screen w-1/2 overflow-hidden bg-[#0f2a4d] px-12 py-10 text-white lg:flex lg:flex-col">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#21579f]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="relative shrink-0">
            <BrandMark light />
          </div>
          <div className="relative flex max-w-md flex-1 flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-200">
              Mali müşavir paneli
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Fişleri saniyeler içinde Excel’e aktarın
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              ÖKC fişi ve fatura fotoğraflarını yükleyin, GİB işletme defteri
              şablonunu indirin.
            </p>
            <ol className="mt-10 space-y-4 text-sm text-white/85">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                  1
                </span>
                Fiş fotoğraflarını yükleyin
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                  2
                </span>
                Faturaları oku butonuna basın ve bekleyin
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                  3
                </span>
                Listeyi kontrol edip Excel indir butonuna basın
              </li>
            </ol>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 items-center justify-center px-4 py-12">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_rgba(15,42,77,0.08)]"
          >
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-900 lg:mt-0">
              Giriş yapın
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Fatura okuma paneline devam etmek için şifrenizi yazın.
            </p>
            {!session.configured ? (
              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Sunucuda ADMIN_PASSWORD tanımlı değil.
              </p>
            ) : null}
            <label
              className="mt-7 block text-sm font-medium text-slate-700"
              htmlFor="admin-password"
            >
              Şifre
            </label>
            <div className="relative mt-1.5">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-[#21579f] focus:ring-4 focus:ring-[#21579f]/15"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-[#21579f]"
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
            {authError ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {authError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={authBusy || !session.configured}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#21579f] px-4 py-3 font-medium text-white shadow-lg shadow-[#21579f]/25 transition hover:bg-[#1a4785] disabled:opacity-60"
            >
              {authBusy ? (
                <>
                  <Spinner />
                  Giriş yapılıyor
                </>
              ) : (
                "Panele gir"
              )}
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {(extracting || exporting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2a4d]/55 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#21579f]/10 text-[#21579f]">
              <Spinner className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">
              {extracting ? extractLabel : "Excel hazırlanıyor"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {extracting
                ? "Bir fotoğrafta birden fazla fiş varsa 30–60 saniye sürebilir. Sayfayı kapatmayın."
                : "GİB şablonu dolduruluyor."}
            </p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-[#21579f]" />
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <BrandMark />
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Çıkış
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 mt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            ÖKC / fatura aktarımı
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fotoğrafları yükleyin, GİB Excel’ini indirin.
          </p>
        </div>

        {!session.visionReady ? (
          <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Görüntü okuma için GEMINI_API_KEY tanımlayın.
          </p>
        ) : null}

        <section
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            addFiles(event.dataTransfer.files);
          }}
          className={`rounded-3xl border-2 border-dashed bg-white p-6 shadow-sm transition ${
            dragOver ? "border-[#21579f] bg-sky-50" : "border-slate-200"
          }`}
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-medium">Fiş / fatura görselleri</h2>
              <p className="mt-1 text-sm text-slate-500">
                JPG, PNG veya WEBP. Bir fotoğrafta birden fazla fiş olabilir. En
                fazla 20 görsel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-[#21579f] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#21579f]/20 hover:bg-[#1a4785]"
            >
              Görsel seç
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              hidden
              onChange={(event) => {
                if (event.target.files) {
                  addFiles(event.target.files);
                }
                event.target.value = "";
              }}
            />
          </div>

          {files.length > 0 ? (
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {files.map((item) => (
                <li
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Sil
                  </button>
                  <p className="truncate px-2 py-1.5 text-xs text-slate-600">
                    {item.file.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              Fotoğrafları buraya sürükleyin veya görsel seçin.
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleExtract()}
              disabled={extracting || files.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-[#21579f] px-5 py-2.5 font-medium text-white shadow-md shadow-[#21579f]/20 hover:bg-[#1a4785] disabled:opacity-50"
            >
              {extracting ? <Spinner /> : null}
              {extracting ? "Okunuyor" : "Faturaları oku"}
            </button>
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={exporting || rows.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-[#21579f] px-5 py-2.5 font-medium text-[#21579f] hover:bg-[#21579f]/5 disabled:opacity-50"
            >
              {exporting ? <Spinner className="h-5 w-5" /> : null}
              {exporting ? "Hazırlanıyor" : "Excel indir"}
            </button>
          </div>
        </section>

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

        {rows.length > 0 ? (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ["Satır", String(rows.length)],
                ["Matrah", money.format(totals.net)],
                ["KDV", money.format(totals.vat)],
                ["Genel toplam", money.format(totals.gross)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <section className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full text-left text-sm">
                  <thead className="bg-[#0f2a4d] text-white">
                    <tr>
                      <th className="px-3 py-3 font-medium">Tarih</th>
                      <th className="px-3 py-3 font-medium">Fiş No</th>
                      <th className="px-3 py-3 font-medium">VKN / TCKN</th>
                      <th className="px-3 py-3 font-medium">Unvan</th>
                      <th className="px-3 py-3 font-medium">KDV %</th>
                      <th className="px-3 py-3 font-medium">Matrah</th>
                      <th className="px-3 py-3 font-medium">KDV Dahil</th>
                      <th className="px-3 py-3 font-medium">Gider alt türü</th>
                      <th className="px-3 py-3 font-medium">Açıklama</th>
                      <th className="px-3 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-slate-100 align-top even:bg-slate-50/60"
                      >
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            value={row.belgeTarihi}
                            onChange={(event) =>
                              updateRow(row.id, {
                                belgeTarihi: event.target.value,
                                deftereKayitTarihi: event.target.value,
                              })
                            }
                            className={`${fieldClass} w-36`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.fisNo}
                            onChange={(event) =>
                              updateRow(row.id, { fisNo: event.target.value })
                            }
                            className={`${fieldClass} w-28`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.tcknVkn}
                            onChange={(event) =>
                              updateRow(row.id, { tcknVkn: event.target.value })
                            }
                            className={`${fieldClass} w-32`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.soyadiUnvan}
                            onChange={(event) =>
                              updateRow(row.id, {
                                soyadiUnvan: event.target.value,
                              })
                            }
                            className={`${fieldClass} w-44`}
                          />
                          {row.notes ? (
                            <p className="mt-1 text-xs text-amber-700">
                              {row.notes}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.kdvOrani ?? ""}
                            onChange={(event) =>
                              updateRow(row.id, {
                                kdvOrani:
                                  event.target.value === ""
                                    ? null
                                    : Number(event.target.value),
                              })
                            }
                            className={fieldClass}
                          >
                            <option value="">—</option>
                            {KDV_ORANLARI.map((rate) => (
                              <option key={rate} value={rate}>
                                {rate}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={row.tutarKdvHaric ?? ""}
                            onChange={(event) =>
                              updateRow(row.id, {
                                tutarKdvHaric:
                                  event.target.value === ""
                                    ? null
                                    : Number(event.target.value),
                              })
                            }
                            className={`${fieldClass} w-28`}
                          />
                        </td>
                        <td className="px-3 py-2 pt-3 font-medium text-slate-700">
                          {row.kdvDahilToplam === null
                            ? "—"
                            : money.format(row.kdvDahilToplam)}
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.giderKayitAltTuru}
                            onChange={(event) => {
                              const alt = GIDER_KAYIT_ALT_TURLERI.find(
                                (item) => item.kod === event.target.value,
                              );
                              updateRow(row.id, {
                                giderKayitAltTuru: event.target.value,
                                giderKayitTuru: alt?.ust ?? row.giderKayitTuru,
                              });
                            }}
                            className={`${fieldClass} max-w-56`}
                          >
                            {GIDER_KAYIT_ALT_TURLERI.filter(
                              (item) =>
                                item.ust === row.giderKayitTuru ||
                                item.kod === row.giderKayitAltTuru,
                            ).map((item) => (
                              <option key={item.kod} value={item.kod}>
                                {item.kod} — {item.ad}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              GIDER_KAYIT_TURLERI.find(
                                (item) => item.kod === row.giderKayitTuru,
                              )?.ad
                            }
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.aciklama}
                            onChange={(event) =>
                              updateRow(row.id, {
                                aciklama: event.target.value,
                              })
                            }
                            className={`${fieldClass} w-44`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

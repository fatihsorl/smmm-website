"use client";

import { useEffect, useMemo, useState } from "react";
import { AYLAR, TAKIP_KATEGORILERI, type AylikTakipSatiri, type TakipDurum, type TakipKategori } from "@/lib/mukellef-types";

function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}

const NEXT_DURUM: Record<TakipDurum, TakipDurum> = {
  bekliyor: "tamamlandi",
  tamamlandi: "tabi_degil",
  tabi_degil: "bekliyor",
};

const DURUM_STYLE: Record<TakipDurum, string> = {
  tamamlandi: "bg-emerald-100 text-emerald-700 border-emerald-300",
  bekliyor: "bg-amber-50 text-amber-700 border-amber-200",
  tabi_degil: "bg-slate-100 text-slate-400 border-slate-200",
};

const DURUM_LABEL: Record<TakipDurum, string> = {
  tamamlandi: "✓",
  bekliyor: "○",
  tabi_degil: "—",
};

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Sunucu beklenmeyen yanıt verdi.");
  }
}

function currentYear() {
  return new Date().getFullYear();
}

export default function AylikTakip() {
  const [yil, setYil] = useState(currentYear());
  const [ay, setAy] = useState(new Date().getMonth() + 1);
  const [rows, setRows] = useState<AylikTakipSatiri[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const donem = useMemo(() => `${yil}-${String(ay).padStart(2, "0")}`, [yil, ay]);
  const yillar = useMemo(() => {
    const now = currentYear();
    return [now - 1, now, now + 1];
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/mukellef/takip?donem=${donem}`, { cache: "no-store" });
      const data = await readJson<{ rows?: AylikTakipSatiri[]; message?: string }>(response);
      if (!response.ok) {
        throw new Error(data.message ?? "Liste alınamadı.");
      }
      setRows(data.rows ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Liste alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donem]);

  async function toggleHucre(mukellefId: number, kategori: TakipKategori, current: TakipDurum, duzenlenebilir: boolean) {
    if (!duzenlenebilir) {
      return;
    }
    const key = `${mukellefId}:${kategori}`;
    setSaving(key);
    const nextDurum = NEXT_DURUM[current];
    try {
      const response = await fetch("/api/admin/mukellef/takip", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mukellefId, donem, kategori, durum: nextDurum }),
      });
      const data = await readJson<{ message?: string }>(response);
      if (!response.ok) {
        throw new Error(data.message ?? "Güncellenemedi.");
      }
      setRows((current) =>
        current.map((row) =>
          row.mukellefId === mukellefId
            ? {
                ...row,
                hucreler: row.hucreler.map((h) => (h.kategori === kategori ? { ...h, durum: nextDurum } : h)),
              }
            : row,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncellenemedi.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {yillar.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYil(y)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              yil === y ? "bg-[#0f2a4d] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {AYLAR.map((ayAdi, index) => (
          <button
            key={ayAdi}
            type="button"
            onClick={() => setAy(index + 1)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              ay === index + 1 ? "bg-[#21579f] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {ayAdi}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Hücreye tıklayınca sırayla değişir: ○ Bekliyor → ✓ Tamamlandı → — Tabi değil. Gri/kilitli hücreler otomatik
        belirlenir (SGK aylık olmayanlar, Geçici Vergi&apos;nin uygulanmadığı aylar) ve elle değiştirilemez.
      </p>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <Spinner className="h-4 w-4" /> Yükleniyor...
        </div>
      ) : (
        <section className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto text-left text-sm">
              <thead className="bg-[#0f2a4d] text-white">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Mükellef</th>
                  {TAKIP_KATEGORILERI.map((k) => (
                    <th key={k.key} className="whitespace-nowrap px-2 py-3 text-center font-medium">
                      {k.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.mukellefId} className="border-t border-slate-100 even:bg-slate-50/60">
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-800">{row.unvan}</td>
                    {row.hucreler.map((hucre) => {
                      const key = `${row.mukellefId}:${hucre.kategori}`;
                      return (
                        <td key={hucre.kategori} className="px-2 py-2 text-center">
                          <button
                            type="button"
                            disabled={!hucre.duzenlenebilir || saving === key}
                            onClick={() => void toggleHucre(row.mukellefId, hucre.kategori, hucre.durum, hucre.duzenlenebilir)}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                              DURUM_STYLE[hucre.durum]
                            } ${hucre.duzenlenebilir ? "cursor-pointer hover:brightness-95" : "cursor-not-allowed"}`}
                            title={hucre.duzenlenebilir ? "Durumu değiştirmek için tıklayın" : "Otomatik belirlenir"}
                          >
                            {saving === key ? <Spinner className="h-3.5 w-3.5" /> : DURUM_LABEL[hucre.durum]}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={TAKIP_KATEGORILERI.length + 1} className="px-4 py-8 text-center text-sm text-slate-500">
                      Aktif mükellef bulunamadı.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

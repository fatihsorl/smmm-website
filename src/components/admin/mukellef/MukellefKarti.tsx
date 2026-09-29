"use client";

import { useEffect, useMemo, useState } from "react";
import { TAKIP_KATEGORILERI, type Mukellef, type MukellefListItem, type TakipDurum } from "@/lib/mukellef-types";

function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}

const DURUM_LABEL: Record<TakipDurum, string> = {
  tamamlandi: "✓",
  bekliyor: "○",
  tabi_degil: "—",
};

const DURUM_STYLE: Record<TakipDurum, string> = {
  tamamlandi: "bg-emerald-100 text-emerald-700",
  bekliyor: "bg-amber-50 text-amber-700",
  tabi_degil: "bg-slate-100 text-slate-400",
};

type KartResponse = {
  mukellef: Mukellef;
  aylar: Array<{ donem: string; ayAdi: string; hucreler: Array<{ kategori: string; durum: TakipDurum }> }>;
};

function SecretRow({ label, value }: { label: string; value: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="flex items-center gap-2 font-medium text-slate-800">
        {value ? (visible ? value : "••••••••") : "—"}
        {value ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-xs font-medium text-[#21579f]"
          >
            {visible ? "Gizle" : "Göster"}
          </button>
        ) : null}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value === null || value === "" ? "—" : value}</span>
    </div>
  );
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Sunucu beklenmeyen yanıt verdi.");
  }
}

export default function MukellefKarti() {
  const [list, setList] = useState<MukellefListItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [yil, setYil] = useState(new Date().getFullYear());
  const [kart, setKart] = useState<KartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const yillar = useMemo(() => {
    const now = new Date().getFullYear();
    return [now - 1, now, now + 1];
  }, []);

  useEffect(() => {
    async function loadList() {
      try {
        const response = await fetch("/api/admin/mukellef", { cache: "no-store" });
        const data = await readJson<{ rows?: MukellefListItem[]; message?: string }>(response);
        if (!response.ok) {
          throw new Error(data.message ?? "Liste alınamadı.");
        }
        setList(data.rows ?? []);
        if (data.rows?.length) {
          setSelectedId(data.rows[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Liste alınamadı.");
      }
    }
    void loadList();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setLoading(false);
      return;
    }
    async function loadKart() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/admin/mukellef/${selectedId}/kart?yil=${yil}`, { cache: "no-store" });
        const data = await readJson<KartResponse & { message?: string }>(response);
        if (!response.ok) {
          throw new Error(data.message ?? "Kart alınamadı.");
        }
        setKart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kart alınamadı.");
      } finally {
        setLoading(false);
      }
    }
    void loadKart();
  }, [selectedId, yil]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#21579f] focus:ring-2 focus:ring-[#21579f]/20"
        >
          {list.map((item) => (
            <option key={item.id} value={item.id}>
              {item.unvan}
            </option>
          ))}
        </select>

        <div className="flex gap-1.5">
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
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <Spinner className="h-4 w-4" /> Yükleniyor...
        </div>
      ) : kart ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">Genel Bilgiler</h2>
            <div className="mt-2">
              <InfoRow label="Unvan" value={kart.mukellef.unvan} />
              <InfoRow label="Tam Unvan" value={kart.mukellef.tamUnvan} />
              <InfoRow label="Vergi No" value={kart.mukellef.vergiNo} />
              <InfoRow label="T.C. Kimlik No" value={kart.mukellef.tckn} />
              <InfoRow label="Ticaret Sicil No" value={kart.mukellef.ticaretSicilNo} />
              <InfoRow label="Mersis" value={kart.mukellef.mersis} />
              <InfoRow label="Nevi" value={kart.mukellef.nevi} />
              <InfoRow label="Adres" value={kart.mukellef.adres} />
              <InfoRow label="SGK Aylık" value={kart.mukellef.sgkAylik || "Tabi değil"} />
              <InfoRow label="E-Defter" value={kart.mukellef.eDefter} />
              <InfoRow label="Muhtasar" value={kart.mukellef.muhtasar} />
              <InfoRow label="Ücret" value={kart.mukellef.ucret} />
              <InfoRow label="Sermaye" value={kart.mukellef.sermaye} />
              <InfoRow label="Geçen Yıldan Borçlar" value={kart.mukellef.gecenYildanBorclar} />
              <InfoRow label="Not" value={kart.mukellef.not2} />
            </div>

            <h2 className="mt-5 text-sm font-semibold text-slate-800">Şifreler</h2>
            <div className="mt-2">
              <InfoRow label="GİB Kullanıcı Kodu" value={kart.mukellef.gibKullaniciKodu} />
              <SecretRow label="GİB Şifre" value={kart.mukellef.gibSifre} />
              <InfoRow label="SGK Kullanıcı Adı" value={kart.mukellef.sgkKullaniciAdi} />
              <SecretRow label="SGK Sistem Şifre" value={kart.mukellef.sgkSistemSifre} />
              <SecretRow label="SGK İşyeri Şifre" value={kart.mukellef.sgkIsyeriSifre} />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">{yil} Yılı Aylık Takip Durumu</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] table-auto text-left text-sm">
                <thead className="bg-[#0f2a4d] text-white">
                  <tr>
                    <th className="whitespace-nowrap px-2 py-2 font-medium">Ay</th>
                    {TAKIP_KATEGORILERI.map((k) => (
                      <th key={k.key} className="whitespace-nowrap px-2 py-2 text-center font-medium">
                        {k.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kart.aylar.map((ay) => (
                    <tr key={ay.donem} className="border-t border-slate-100 even:bg-slate-50/60">
                      <td className="whitespace-nowrap px-2 py-2 font-medium text-slate-700">{ay.ayAdi}</td>
                      {ay.hucreler.map((h) => (
                        <td key={h.kategori} className="px-2 py-2 text-center">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded ${DURUM_STYLE[h.durum]}`}
                          >
                            {DURUM_LABEL[h.durum]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

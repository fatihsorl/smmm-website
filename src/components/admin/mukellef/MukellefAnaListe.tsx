"use client";

import { useEffect, useState } from "react";
import type { Mukellef, MukellefInput, MukellefListItem } from "@/lib/mukellef-types";

function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}

const EMPTY_FORM: MukellefInput = {
  sira: null,
  unvan: "",
  tamUnvan: "",
  ticaretSicilNo: "",
  mersis: "",
  vergiNo: "",
  tckn: "",
  gibKullaniciKodu: "",
  gibSifre: "",
  sgkKullaniciAdi: "",
  sgkSistemSifre: "",
  sgkIsyeriSifre: "",
  sgkAylik: "",
  eDefter: "",
  muhtasar: "",
  nevi: "",
  ucret: null,
  sermaye: null,
  gecenYildanBorclar: null,
  not2: "",
  adres: "",
  kullanim: "",
};

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#21579f] focus:ring-2 focus:ring-[#21579f]/20";
const labelClass = "block text-xs font-medium text-slate-500";

function SecretField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative mt-1">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldClass} pr-14`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-[#21579f]"
        >
          {visible ? "Gizle" : "Göster"}
        </button>
      </div>
    </div>
  );
}

function MukellefForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Mukellef | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<MukellefInput>(initial ?? EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof MukellefInput>(key: K, value: MukellefInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.unvan.trim()) {
      setError("Unvan zorunlu.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = initial ? `/api/admin/mukellef/${initial.id}` : "/api/admin/mukellef";
      const response = await fetch(url, {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? "Kaydedilemedi.");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#0f2a4d]/50 px-4 py-8 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          {initial ? "Mükellefi düzenle" : "Yeni mükellef"}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Unvan (kısa kod)</label>
            <input value={form.unvan} onChange={(e) => set("unvan", e.target.value)} className={`${fieldClass} mt-1`} required />
          </div>
          <div>
            <label className={labelClass}>Tam Unvan</label>
            <input value={form.tamUnvan} onChange={(e) => set("tamUnvan", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Vergi No</label>
            <input value={form.vergiNo} onChange={(e) => set("vergiNo", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>T.C. Kimlik No</label>
            <input value={form.tckn} onChange={(e) => set("tckn", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Ticaret Sicil No</label>
            <input value={form.ticaretSicilNo} onChange={(e) => set("ticaretSicilNo", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Mersis</label>
            <input value={form.mersis} onChange={(e) => set("mersis", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Nevi</label>
            <input value={form.nevi} onChange={(e) => set("nevi", e.target.value)} className={`${fieldClass} mt-1`} placeholder="LTD, AŞ, ŞAHIS..." />
          </div>
          <div>
            <label className={labelClass}>Sıra</label>
            <input
              type="number"
              value={form.sira ?? ""}
              onChange={(e) => set("sira", e.target.value === "" ? null : Number(e.target.value))}
              className={`${fieldClass} mt-1`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Adres</label>
            <input value={form.adres} onChange={(e) => set("adres", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>

          <div>
            <label className={labelClass}>SGK Aylık</label>
            <input
              value={form.sgkAylik}
              onChange={(e) => set("sgkAylik", e.target.value)}
              className={`${fieldClass} mt-1`}
              placeholder="AYLIK ya da boş"
            />
          </div>
          <div>
            <label className={labelClass}>E-Defter</label>
            <input value={form.eDefter} onChange={(e) => set("eDefter", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <div>
            <label className={labelClass}>Muhtasar</label>
            <input value={form.muhtasar} onChange={(e) => set("muhtasar", e.target.value)} className={`${fieldClass} mt-1`} placeholder="AYLIK / ÜÇ AYLIK" />
          </div>

          <div>
            <label className={labelClass}>GİB Kullanıcı Kodu</label>
            <input value={form.gibKullaniciKodu} onChange={(e) => set("gibKullaniciKodu", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <SecretField label="GİB Şifre" value={form.gibSifre} onChange={(v) => set("gibSifre", v)} />
          <div>
            <label className={labelClass}>SGK Kullanıcı Adı</label>
            <input value={form.sgkKullaniciAdi} onChange={(e) => set("sgkKullaniciAdi", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
          <SecretField label="SGK Sistem Şifre" value={form.sgkSistemSifre} onChange={(v) => set("sgkSistemSifre", v)} />
          <SecretField label="SGK İşyeri Şifre" value={form.sgkIsyeriSifre} onChange={(v) => set("sgkIsyeriSifre", v)} />

          <div>
            <label className={labelClass}>Ücret</label>
            <input
              type="number"
              step="0.01"
              value={form.ucret ?? ""}
              onChange={(e) => set("ucret", e.target.value === "" ? null : Number(e.target.value))}
              className={`${fieldClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Sermaye</label>
            <input
              type="number"
              step="0.01"
              value={form.sermaye ?? ""}
              onChange={(e) => set("sermaye", e.target.value === "" ? null : Number(e.target.value))}
              className={`${fieldClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Geçen Yıldan Borçlar</label>
            <input
              type="number"
              step="0.01"
              value={form.gecenYildanBorclar ?? ""}
              onChange={(e) => set("gecenYildanBorclar", e.target.value === "" ? null : Number(e.target.value))}
              className={`${fieldClass} mt-1`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Not</label>
            <input value={form.not2} onChange={(e) => set("not2", e.target.value)} className={`${fieldClass} mt-1`} />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#21579f] px-5 py-2 text-sm font-medium text-white hover:bg-[#1a4785] disabled:opacity-50"
          >
            {saving ? <Spinner className="h-4 w-4" /> : null}
            Kaydet
          </button>
        </div>
      </form>
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

export default function MukellefAnaListe() {
  const [rows, setRows] = useState<MukellefListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Mukellef | null | "new">(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/mukellef", { cache: "no-store" });
      const data = await readJson<{ rows?: MukellefListItem[]; message?: string }>(response);
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
  }, []);

  async function openEdit(id: number) {
    try {
      const response = await fetch(`/api/admin/mukellef/${id}`, { cache: "no-store" });
      const data = await readJson<{ mukellef?: Mukellef; message?: string }>(response);
      if (!response.ok || !data.mukellef) {
        throw new Error(data.message ?? "Mükellef alınamadı.");
      }
      setEditing(data.mukellef);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mükellef alınamadı.");
    }
  }

  async function handleRemove(id: number, unvan: string) {
    if (!window.confirm(`${unvan} mükellefini pasif hale getirmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/mukellef/${id}`, { method: "DELETE" });
      const data = await readJson<{ message?: string }>(response);
      if (!response.ok) {
        throw new Error(data.message ?? "Silinemedi.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{rows.length} aktif mükellef</p>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-xl bg-[#21579f] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a4785]"
        >
          + Yeni mükellef
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner className="h-4 w-4" /> Yükleniyor...
        </div>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto text-left text-sm">
              <thead className="bg-[#0f2a4d] text-white">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Sıra</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Unvan</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Tam Unvan</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Vergi No</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Nevi</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">SGK Aylık</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Muhtasar</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 even:bg-slate-50/60">
                    <td className="px-3 py-2 text-slate-500">{row.sira ?? "—"}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">{row.unvan}</td>
                    <td className="px-3 py-2 text-slate-600">{row.tamUnvan}</td>
                    <td className="px-3 py-2 text-slate-600">{row.vergiNo}</td>
                    <td className="px-3 py-2 text-slate-600">{row.nevi}</td>
                    <td className="px-3 py-2 text-slate-600">{row.sgkAylik || "—"}</td>
                    <td className="px-3 py-2 text-slate-600">{row.muhtasar || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => void openEdit(row.id)}
                        className="mr-2 rounded-lg px-2 py-1 text-xs font-medium text-[#21579f] hover:bg-[#21579f]/10"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleRemove(row.id, row.unvan)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {editing ? (
        <MukellefForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}

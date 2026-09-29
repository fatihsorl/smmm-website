"use client";

import { useState } from "react";
import MukellefAnaListe from "@/components/admin/mukellef/MukellefAnaListe";
import AylikTakip from "@/components/admin/mukellef/AylikTakip";
import MukellefKarti from "@/components/admin/mukellef/MukellefKarti";

type SubTab = "liste" | "takip" | "kart";

const SUB_TABS: Array<{ key: SubTab; label: string }> = [
  { key: "liste", label: "Ana Liste" },
  { key: "takip", label: "Aylık Takip" },
  { key: "kart", label: "Mükellef Kartı" },
];

export default function MukellefView() {
  const [tab, setTab] = useState<SubTab>("liste");

  return (
    <div>
      <div className="mb-6 mt-6">
        <h1 className="text-2xl font-semibold tracking-tight">Mükellef takip</h1>
        <p className="mt-1 text-sm text-slate-500">
          Mükellef listesi, aylık beyanname/SGK takibi ve mükellef bilgi kartı.
        </p>
      </div>

      <div className="mb-5 inline-flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {SUB_TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              tab === item.key
                ? "bg-[#21579f] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "liste" ? <MukellefAnaListe /> : null}
      {tab === "takip" ? <AylikTakip /> : null}
      {tab === "kart" ? <MukellefKarti /> : null}
    </div>
  );
}

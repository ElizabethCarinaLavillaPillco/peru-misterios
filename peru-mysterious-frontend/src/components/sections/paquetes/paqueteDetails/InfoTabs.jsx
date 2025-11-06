// src/components/paquetes/paqueteDetails/InfoTabs.jsx
"use client";
import { useState } from "react";

const TABS = [
  { key: "incluye", label: "Incluye" },
  { key: "noIncluye", label: "No incluye" },
  { key: "queLlevar", label: "Qué llevar" },
];

export default function InfoTabs({ incluye = [], noIncluye = [], queLlevar = [] }) {
  const [tab, setTab] = useState("incluye");

  const content = {
    incluye,
    noIncluye,
    queLlevar,
  };

  return (
    <section className="mt-8 rounded-2xl border border-[var(--pm-gold,#E5A400)]/30 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-4 py-2 text-sm transition
                ${active
                  ? "bg-[var(--pm-gold,#E5A400)] text-black border-[var(--pm-gold,#E5A400)]"
                  : "text-[var(--pm-black,#1E1E1E)] border-[var(--pm-gold,#E5A400)]/40 hover:border-[var(--pm-gold,#E5A400)]"}`}
              aria-pressed={active}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-4 grid sm:grid-cols-2 gap-2 list-disc pl-5 text-[var(--pm-gray-dark,#373435)]">
        {(content[tab] ?? []).map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </section>
  );
}

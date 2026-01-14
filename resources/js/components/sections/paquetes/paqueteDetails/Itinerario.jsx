import React from 'react';
"use client";
import { useState } from "react";

export default function Itinerario({ dias = [] }) {
  // dias: [{ titulo: "Día 1: Cusco – Km82", descripcion: "detalle", hitos: ["Check-in", "Almuerzo", "Caminata"], comida: "Desayuno/Almuerzo", alojamiento: "Campamento" }, ...]
  const [open, setOpen] = useState(0);

  return (
    <section className="mt-8 rounded-2xl border border-[var(--pm-gold,#E5A400)]/30 bg-white p-6 shadow-sm">
      <h2 className="font-russo text-2xl text-[var(--pm-black,#1E1E1E)] mb-4">Itinerario</h2>

      <ol className="relative ml-1">
        <span className="absolute left-0 top-0 bottom-0 w-px bg-[var(--pm-gold,#E5A400)]/40 translate-x-[-1px]" aria-hidden />
        {dias.map((d, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className="pl-6 relative">
              <span className="absolute left-[-6px] top-2 block w-3 h-3 rounded-full bg-[var(--pm-gold,#E5A400)] shadow" aria-hidden />
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full text-left py-3 border-b border-[var(--pm-gold,#E5A400)]/20 hover:bg-[#FFF8EA]/60 rounded-md transition"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{d.titulo}</p>
                  <span className="text-xs text-[var(--pm-gray-dark,#373435)]">
                    {d.comida ? `• ${d.comida}` : ""} {d.alojamiento ? `• ${d.alojamiento}` : ""}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="py-3 text-[var(--pm-gray-dark,#373435)]">
                  <p>{d.descripcion}</p>
                  {d.hitos?.length ? (
                    <ul className="mt-2 grid sm:grid-cols-2 gap-1 list-disc pl-4">
                      {d.hitos.map((h, idx) => <li key={idx}>{h}</li>)}
                    </ul>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

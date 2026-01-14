import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { Navigate, replace, useNavigate, useSearchParams } from "react-router-dom";

const CIUDADES = ["Puno","Madre de Dios","Lima","Ica","Huaraz","Cusco","Arequipa","Apurímac"];

export default function FiltroPaquetes() {
  const navigate = useNavigate()
  const sp = useSearchParams();

  // Estado inicial desde URL
  const [price, setPrice] = useState(Number(sp.get("precioMax") ?? 10000));
  const [days, setDays] = useState(Number(sp.get("diasMax") ?? 20));
  const [dificultad, setDificultad] = useState(sp.get("dificultad") ?? "");
  const [ciudades, setCiudades] = useState(
    sp.get("ciudades") ? sp.get("ciudades").split(",") : []
  );

  // Construye query string cada cambio (excepto reset)
  useEffect(() => {
    const q = new URLSearchParams(sp.toString());
    q.set("precioMax", String(price));
    q.set("diasMax", String(days));
    dificultad ? q.set("dificultad", dificultad) : q.delete("dificultad");
    ciudades.length ? q.set("ciudades", ciudades.join(",")) : q.delete("ciudades");
    Navigate(`?${q.toString()}`, { replace: true, scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, days, dificultad, ciudades]);

  const reset = () => {
    setPrice(10000);
    setDays(20);
    setDificultad("");
    setCiudades([]);
    const q = new URLSearchParams(sp.toString());
    ["precioMax","diasMax","dificultad","ciudades"].forEach(k => q.delete(k));
    navigate(`?${q.toString()}`, { replace: true, scroll: false });
  };

  const box = "rounded-2xl border border-[var(--pm-gold,#E5A400)]/35 bg-white p-4 shadow-sm";
  const label = "text-sm font-bold text-[var(--pm-black,#1E1E1E)]";
  const caption = "text-xs text-[var(--pm-gray-dark,#373435)]";

  const selectedCount = useMemo(() => ciudades.length, [ciudades]);

  return (
    <aside className="rounded-3xl bg-white p-4 shadow-md border border-[var(--pm-gold,#E5A400)]/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-russo text-2xl text-[var(--pm-black,#1E1E1E)]">Filtros</h3>
        <button
          onClick={reset}
          className="rounded-full border border-[var(--pm-gold,#E5A400)] px-3 py-1 text-sm
                     hover:bg-[var(--pm-gold,#E5A400)] hover:text-black transition"
          aria-label="Restablecer filtros"
        >
          Restablecer
        </button>
      </div>

      {/* Ciudades */}
      <div className={box}>
        <p className={label}>Ciudades</p>
        <p className={caption}>Seleccionadas: {selectedCount || 0}</p>
        <ul className="mt-2 space-y-2">
          {CIUDADES.map((c) => {
            const active = ciudades.includes(c);
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() =>
                    setCiudades((prev) =>
                      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                    )
                  }
                  className={`w-full flex items-center gap-2 rounded-2xl px-3 py-2 border transition
                  ${active
                    ? "bg-[var(--pm-gold,#E5A400)]/10 border-[var(--pm-gold,#E5A400)]"
                    : "bg-white border-[var(--pm-gold,#E5A400)]/30 hover:border-[var(--pm-gold,#E5A400)]/60"}`}
                  aria-pressed={active}
                >
                  <span className={`inline-block w-4 h-4 rounded border
                    ${active ? "bg-[var(--pm-gold,#E5A400)] border-[var(--pm-gold,#E5A400)]"
                             : "border-[var(--pm-gold,#E5A400)]/60"}`} />
                  <span className="text-sm">{c}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Precio */}
      <div className={`${box} mt-4`}>
        <div className="flex items-center justify-between">
          <p className={label}>Precio</p>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-[var(--pm-gold,#E5A400)] text-black">
            S/ {price.toLocaleString("es-PE")}
          </span>
        </div>
        <input
          type="range" min={0} max={10000} value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--pm-gold,#E5A400)]"
          aria-label="Precio máximo"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>S/ 0</span><span>S/ 10,000</span>
        </div>
      </div>

      {/* Días */}
      <div className={`${box} mt-4`}>
        <div className="flex items-center justify-between">
          <p className={label}>Días</p>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-[var(--pm-gold,#E5A400)] text-black">
            ≤ {days}
          </span>
        </div>
        <input
          type="range" min={1} max={20} value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--pm-gold,#E5A400)]"
          aria-label="Duración máxima (días)"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>1</span><span>20</span>
        </div>
      </div>

      {/* Dificultad */}
      <div className={`${box} mt-4`}>
        <p className={label}>Dificultad</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {["facil","moderado","dificil"].map((d) => {
            const on = dificultad === d;
            const label = d === "facil" ? "Fácil" : d === "dificil" ? "Difícil" : "Moderado";
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDificultad(on ? "" : d)}
                className={`rounded-full border px-3 py-1 text-sm transition
                ${on
                  ? "bg-[var(--pm-gold,#E5A400)] text-black border-[var(--pm-gold,#E5A400)]"
                  : "text-[var(--pm-black,#1E1E1E)] border-[var(--pm-gold,#E5A400)]/40 hover:border-[var(--pm-gold,#E5A400)]"}`}
                aria-pressed={on}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

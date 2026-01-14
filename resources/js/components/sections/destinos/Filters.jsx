import React from 'react';
import { useMemo } from "react";

const ciudadesBase = ["Puno","Madre de Dios","Lima","Ica","Huaraz","Cusco","Arequipa","Apurímac"];

const PEN = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

export default function Filters({ filtros, setFiltros, ciudades = ciudadesBase }) {
  const onCiudad = (c) => {
    const set = new Set(filtros.ciudades);
    set.has(c) ? set.delete(c) : set.add(c);
    setFiltros({ ...filtros, ciudades: [...set] });
  };

  const resetFiltros = () => {
    setFiltros({
      ciudades: [],
      maxPrecio: 10000,
      maxDias: 20,
    });
  };

  const precioPct = useMemo(
    () => Math.min(100, Math.round((filtros.maxPrecio / 10000) * 100)),
    [filtros.maxPrecio]
  );
  const diasPct = useMemo(
    () => Math.min(100, Math.round((filtros.maxDias / 20) * 100)),
    [filtros.maxDias]
  );

  const trackStyle = (pct) => ({
    background: `linear-gradient(to right, #E5A400 ${pct}%, #EDEDED ${pct}%)`,
    height: 6,
    borderRadius: 999,
    marginTop: 12,
    marginBottom: 12,
    accentColor: "#E5A400", // color del thumb compatible
  });

  return (
    <aside
      className="
        sticky top-24 h-max
        rounded-2xl border border-amber-200/60 bg-white shadow-sm
        p-5
      "
      aria-labelledby="filtros-title"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 id="filtros-title" className="font-russo text-xl tracking-wide text-pm-black">
          Filtros
        </h2>

        <button
          onClick={resetFiltros}
          className="rounded-full border border-pm-gold px-3 py-1 text-sm font-semibold text-pm-gold hover:bg-pm-gold hover:text-black transition"
          aria-label="Restablecer filtros"
        >
          Restablecer
        </button>
      </div>

      {/* Ciudades */}
      <section className="mb-6">
        <p className="mb-2 text-sm font-semibold text-pm-black">Ciudades</p>

        <div className="grid grid-cols-1 gap-2">
          {ciudades.map((c) => {
            const checked = filtros.ciudades.includes(c);
            return (
              <label
                key={c}
                className={`group flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                  checked
                    ? "border-pm-gold bg-[#FFF9E8]"
                    : "border-amber-200/70 bg-white hover:bg-amber-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-[var(--pm-gold,#E5A400)] h-4 w-4"
                  checked={checked}
                  onChange={() => onCiudad(c)}
                />
                <span className="text-pm-black">{c}</span>
              </label>
            );
          })}
        </div>

        {filtros.ciudades.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filtros.ciudades.map((c) => (
              <span
                key={`chip-${c}`}
                className="rounded-full border border-amber-200/70 bg-white px-3 py-1 text-xs font-semibold text-pm-black"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Precio */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-pm-black">Precio</p>
          <span className="rounded-full bg-[var(--pm-gold,#E5A400)] px-2.5 py-0.5 text-xs font-bold text-black" aria-live="polite">
            {PEN.format(filtros.maxPrecio)}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={10000}
          step={50}
          value={filtros.maxPrecio}
          onChange={(e) => setFiltros({ ...filtros, maxPrecio: Number(e.target.value) })}
          aria-label="Precio máximo"
          className="w-full appearance-none bg-transparent focus:outline-none"
          style={trackStyle(precioPct)}
        />
        <div className="mt-1 flex justify-between text-[11px] text-pm-gray-dark/80">
          <span>{PEN.format(0)}</span>
          <span>{PEN.format(10000)}</span>
        </div>
      </section>

      {/* Días */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-pm-black">Días</p>
          <span className="rounded-full bg-[var(--pm-gold,#E5A400)] px-2.5 py-0.5 text-xs font-bold text-black" aria-live="polite">
            ≤ {filtros.maxDias}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={filtros.maxDias}
          onChange={(e) => setFiltros({ ...filtros, maxDias: Number(e.target.value) })}
          aria-label="Número máximo de días"
          className="w-full appearance-none bg-transparent focus:outline-none"
          style={trackStyle(diasPct)}
        />
        <div className="mt-1 flex justify-between text-[11px] text-pm-gray-dark/80">
          <span>0</span>
          <span>20</span>
        </div>
      </section>
    </aside>
  );
}
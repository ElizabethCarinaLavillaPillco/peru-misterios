import { useMemo } from "react";
import DestinoCard from "./DestinoCard";

export default function DestinosGrid({ data = [], filtros = {}, onSelect }) {
  // Defaults seguros
  const {
    ciudades = [],
    maxPrecio = Number.POSITIVE_INFINITY,
    maxDias = Number.POSITIVE_INFINITY,
  } = filtros || {};

  // Filtro memoizado
  const list = useMemo(() => {
    return (data || [])
      .filter((d) => (ciudades.length ? ciudades.includes(d.ciudad) : true))
      .filter((d) => (typeof d.precio === "number" ? d.precio <= maxPrecio : true))
      .filter((d) => ((d.dias ?? 1) <= maxDias));
  }, [data, ciudades, maxPrecio, maxDias]);

  return (
    <section
      id="destinos"
      className="relative bg-gradient-to-b from-white to-[#FFF9E8]/40 text-pm-black"
      aria-labelledby="destinos-title"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1
                id="destinos-title"
                className="font-russo text-3xl md:text-4xl tracking-wide"
              >
                Destinos
              </h1>
              <p className="mt-1 text-sm text-pm-gray-dark/90">
                Explora experiencias únicas con un servicio premium.
              </p>
            </div>

            {/* Resultado count */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200/70 bg-white px-4 py-2 text-sm font-semibold">
              <span className="opacity-80">Resultados</span>
              <span className="rounded-full bg-[var(--pm-gold,#E5A400)] px-2.5 py-0.5 text-black font-bold">
                {list.length}
              </span>
            </div>
          </div>

          {/* Chips de filtros activos (solo visual) */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {ciudades.length > 0 && (
              <span className="rounded-full border border-amber-200/70 bg-white px-3 py-1 text-sm">
                Ciudades: <strong>{ciudades.join(", ")}</strong>
              </span>
            )}
            {Number.isFinite(maxPrecio) && maxPrecio !== Number.POSITIVE_INFINITY && (
              <span className="rounded-full border border-amber-200/70 bg-white px-3 py-1 text-sm">
                Precio ≤ <strong>S/ {Math.round(maxPrecio).toLocaleString("es-PE")}</strong>
              </span>
            )}
            {Number.isFinite(maxDias) && maxDias !== Number.POSITIVE_INFINITY && (
              <span className="rounded-full border border-amber-200/70 bg-white px-3 py-1 text-sm">
                Días ≤ <strong>{maxDias}</strong>
              </span>
            )}
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <DestinoCard key={item.id} item={item} onSelect={onSelect} />
          ))}

          {/* Empty state */}
          {list.length === 0 && (
            <div className="col-span-full">
              <div className="rounded-2xl border border-amber-200/60 bg-white p-8 text-center shadow-sm">
                <p className="text-pm-gray-dark">
                  No encontramos destinos con los filtros seleccionados.
                </p>
                <p className="mt-1 text-sm text-pm-gray-dark/80">
                  Prueba ampliando el precio o los días, o quitando alguna ciudad.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
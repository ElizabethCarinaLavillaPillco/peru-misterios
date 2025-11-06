import  React from "react";

import { useState, useEffect } from "react";
import Filters from "@/components/sections/destinos/Filters";
import DestinosGrid from "@/components/sections/destinos/DestinosGrid";
import PlanificaViaje from "@/components/sections/destinos/PlanificaViaje";

const DATA = [
  { id:1, slug:"tour-gastronomico", titulo:"Tour Gastronómico", ciudad:"Lima", precio:320, dias:1, img:"/images/gastro.jpg", resumen:"Delicias culinarias peruanas…", descripcion:"Descripción breve del tour, incluye y recomendaciones." },
  { id:2, slug:"laguna-69-trek",   titulo:"Laguna 69 Trek",   ciudad:"Huaraz", precio:850, dias:1, img:"/images/laguna69.jpg", resumen:"Aventura en la Cordillera Blanca…", descripcion:"Detalles del trekking, altitud, equipo y tiempos." },
  { id:3, slug:"city-tour-cusco",   titulo:"City Tour Cusco",  ciudad:"Cusco",  precio:250, dias:1, img:"/images/cusco.jpg",     resumen:"Historia viva y arquitectura inca…", descripcion:"Paradas del tour, entradas y guía." },
];

export default function DestinosPage() {
  const [filtros, setFiltros] = useState({ ciudades: [], maxPrecio: 10000, maxDias: 20 });
  const [selected, setSelected] = useState(null);

  // Cerrar modal con ESC
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[280px_1fr] gap-8">
        <Filters filtros={filtros} setFiltros={setFiltros} />
        <div className="space-y-8">
          <DestinosGrid data={DATA} filtros={filtros} onSelect={setSelected} />
          <PlanificaViaje />
        </div>
      </div>

      {/* Modal simple */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelected(null)}
          />
          <div className="fixed inset-x-4 md:inset-x-auto md:right-6 md:left-6 top-16 md:top-24 z-50 bg-white rounded-2xl shadow-xl border max-w-4xl mx-auto overflow-hidden">
            <div className="relative h-56 md:h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.img} alt={selected.titulo} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{selected.titulo}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selected.ciudad} • {selected.dias} {selected.dias === 1 ? "día" : "días"} • Desde S/ {selected.precio}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-700">
                {selected.descripcion || selected.resumen}
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 rounded-lg bg-pm-gold hover:bg-pm-gold-dark text-white py-2 font-medium">
                  Consultar disponibilidad
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 rounded-lg border border-black/10 hover:bg-black/5 py-2 font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

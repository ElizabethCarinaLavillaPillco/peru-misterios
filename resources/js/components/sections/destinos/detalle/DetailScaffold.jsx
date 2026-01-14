import React from 'react';
import DetailHeader from "./DetailHeader";
import DetailGallery from "./DetailGallery";
import DetailTabs from "./DetailTabs";
import DetailSidebar from "./DetailSidebar";
import PlanificaViaje from "@/components/sections/destinos/PlanificaViaje";
import { Link } from "react-router-dom";

export default function DetailScaffold({ item = {} }) {
  // Fallbacks seguros para evitar crash si faltan campos
  const {
    titulo = "Destino",
    ciudad,
    descripcion,
    resumen,
    fotos = [],
    img,
  } = item || {};

  const fotosSafe = (Array.isArray(fotos) && fotos.length ? fotos : [img]).filter(Boolean);

  return (
    <main
      className="
        relative
        bg-gradient-to-b from-white to-[#FFF9E8]/40
        text-pm-black
      "
      aria-labelledby="detalle-title"
    >
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10 grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Columna principal */}
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumbs">
            <ol className="flex items-center gap-2 text-sm text-pm-gray-dark/80">
              <li>
                <Link
                  to="/"
                  className="underline-offset-2 hover:text-pm-black hover:underline transition"
                >
                  Inicio
                </Link>
              </li>
              <li className="opacity-70">/</li>
              <li>
                <Link
                  to="/destinos"
                  className="underline-offset-2 hover:text-pm-black hover:underline transition"
                >
                  Destinos
                </Link>
              </li>
              <li className="opacity-70">/</li>
              <li className="font-semibold text-pm-black">
                {titulo}{ciudad ? ` — ${ciudad}` : ""}
              </li>
            </ol>
          </nav>

          {/* Header (título, rating, meta, CTAs) */}
          <DetailHeader item={item} />

          {/* Galería principal */}
          <DetailGallery fotos={fotosSafe} />

          {/* Descripción / resumen con "prose" clara */}
          {(descripcion || resumen) && (
            <section
              aria-labelledby="detalle-descripcion"
              className="
                rounded-2xl border border-amber-200/60 bg-white shadow-sm
                p-5 md:p-6
              "
            >
              <h2
                id="detalle-descripcion"
                className="font-russo text-xl md:text-2xl tracking-wide text-pm-black"
              >
                Descripción
              </h2>
              <hr className="my-4 border-amber-200/50" />
              <div className="prose max-w-none prose-p:leading-relaxed prose-p:text-pm-gray-dark/90">
                <p>{descripcion || resumen}</p>
              </div>
            </section>
          )}

          {/* Tabs (itinerario, incluye, FAQs, etc.) */}
          <DetailTabs item={item} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Sticky en desktop, normal en móvil */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <DetailSidebar item={item} />
            <PlanificaViaje />
          </div>
        </aside>
      </div>
    </main>
  );
}
// src/app/hoteles/page.jsx
import  React from "react";
import { Link } from "react-router-dom";

export const metadata = {
  title: "Hoteles | Perú Mysterious",
  description: "Elige tu ciudad para ver hoteles, habitaciones y ubicación.",
};

export default function HotelesIndexPage() {
  return (
    <main
      className="min-h-[70vh] bg-[#FFF4D1] text-neutral-900"
      data-debug="hoteles-page-v2" // 👈 Verifica esto en el HTML para confirmar que este archivo se carga
    >
      <section className="mx-auto max-w-6xl px-4 py-12 animate-fade-up">
        {/* Título + botón al inicio */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-pm-gold">
              Hoteles en Cusco
            </h1>
            <p className="mt-2 text-neutral-700">
              Explora las mejores opciones en Cusco.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            aria-label="Ir al inicio"
          >
            ← Ir al inicio
          </Link>
        </div>

        {/* Tarjetas de ciudades */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <CityCard
            title="CUSCO INTERNATIONAL HOUSE"
            href="/hoteles/cusco"
            img="https://www.perumysterious.com/wp-content/uploads/2024/10/Pasillo.webp"
          />
          <CityCard
            title="HOSTAL CUSCO INTERNACIONAL"
            href="/hoteles/lima"
            img="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop"
          />
        </div>
      </section>
    </main>
  );
}

function CityCard({ title, href, img }) {
  return (
    <Link
      href={href}
      className="card group relative overflow-hidden rounded-2xl border border-amber-200/70 bg-white/90 shadow-sm backdrop-blur transition will-change-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        src={img}
        alt={title}
        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Degradado para legibilidad */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="absolute bottom-0 p-5">
        {/* 👇 Forzado en blanco con !important */}
        <h3 className="text-2xl font-semibold !text-white drop-shadow">
          {title}
        </h3>

        {/* Si prefieres dorado, cambia la línea de arriba por:
            <h3 className="text-2xl font-semibold !text-[#E5A400] drop-shadow">{title}</h3>
        */}

        <span className="mt-2 inline-block rounded-full bg-amber-500 px-4 py-1 text-sm font-semibold text-black">
          Ver hoteles →
        </span>
      </div>
    </Link>
  );
}

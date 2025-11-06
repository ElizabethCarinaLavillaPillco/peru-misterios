import React from "react";    
import { Link } from "react-router-dom";   

export default function HotelHeader({
  city,
  subtitle,
  coverUrl,
  variant = "light",         // "light" | "dark"
  ctas = [],                 // [{ label, href, className? }]
  overlayClass,              // override del overlay
  titleClass,
  subtitleClass,
}) {
  const light = variant === "light";

  // Overlay por defecto según variante (puedes sobreescribir con overlayClass)
  const defaultOverlay = light
    ? "bg-white/30 backdrop-blur-[0px]"
    : "bg-gradient-to-t from-black via-black/20 to-transparent";

  // Estilo base de botón (lo que no suele cambiar)
  const baseBtn =
    "inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-semibold transition shadow-sm focus-visible:outline-none focus-visible:ring-2";

  // Estilo por defecto si NO pasas className en cada CTA
  const defaultBtn =
    light
      ? "bg-amber-700 text-neutral-900 hover:bg-amber-400 ring-amber-600/20"
      : "bg-amber-700 text-white hover:bg-amber-500 ring-amber-600/20";

  return (
    <header className="relative h-[44vh] min-h-[340px] w-full overflow-hidden">
      <img
        src={coverUrl}
        alt={`Hoteles en ${city}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${overlayClass ?? defaultOverlay}`} />

      <div className={`relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-8 ${light ? "text-neutral-900" : "text-white"}`}>
        {/* Migas + volver */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <nav className={`text-sm ${light ? "text-neutral-600" : "text-neutral-300"}`}>
            <Link href="/hoteles" className={`${light ? "hover:text-neutral-900" : "hover:text-white"}`}>
              Hoteles
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className={`${light ? "text-neutral-900" : "text-white"} font-medium`}>{city}</span>
          </nav>

          {/* Botón al menú principal */}
          <Link
            href="/"
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              light
                ? "border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900"
                : "bg-white/15 hover:bg-white/25 text-white"
            }`}
          >
            ← Ir al inicio
          </Link>
        </div>

        <h1 className={`text-3xl md:text-4xl font-semibold ${titleClass ?? ""}`}>{city}</h1>
        {subtitle && (
          <p className={`mt-2 max-w-2xl ${subtitleClass ?? (light ? "text-neutral-700" : "text-neutral-200")}`}>
            {subtitle}
          </p>
        )}

        {/* CTAs configurables */}
        <div className="mt-5 flex flex-wrap gap-3">
          {ctas.map(({ href, label, className }, i) => (
            <a
              key={i}
              href={href}
              className={`${baseBtn} ${className ?? defaultBtn}`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

// src/components/paquetes/paqueteDetails/EncabezadoPaquete.jsx
import { Link } from "react-router-dom";

export default function EncabezadoPaquete({ titulo, ciudad, categoria, rating = 4.8, duracion = "4 días / 3 noches" }) {
  return (
    <header className="mb-6">
      {/* Migas */}
      <nav className="text-sm mb-2" aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-1 text-[var(--pm-gray-dark,#373435)]">
          <li><Link href="/paquetes" className="hover:underline">Paquetes</Link></li>
          <li>›</li>
          {categoria ? <li><Link href={`/paquetes?categoria=${categoria}`} className="hover:underline capitalize">{categoria}</Link></li> : null}
          {categoria ? <li>›</li> : null}
          <li className="text-[var(--pm-black,#1E1E1E)] font-semibold line-clamp-1">{titulo}</li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-russo text-3xl sm:text-4xl text-[var(--pm-black,#1E1E1E)] leading-tight">
          {titulo}
        </h1>

        <div className="flex items-center gap-2">
          {categoria && (
            <span className="rounded-full bg-[var(--pm-gold,#E5A400)]/90 text-black text-xs font-bold px-2 py-0.5 shadow capitalize">
              {categoria}
            </span>
          )}
          {ciudad && (
            <span className="rounded-full bg-black/75 text-white text-xs px-2 py-0.5">
              {ciudad}
            </span>
          )}
          <span className="ml-2 text-xs flex items-center gap-1">
            <strong>{rating.toFixed(1)}</strong> ★ ★ ★ ★ ★
          </span>
          <span className="text-xs text-[var(--pm-gray-dark,#373435)]">• {duracion}</span>
        </div>
      </div>
    </header>
  );
}

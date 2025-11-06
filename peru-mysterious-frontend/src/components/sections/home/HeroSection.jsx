// src/components/home/HeroSection.jsx

import { useState } from "react";

export default function HeroSection({
  background = { 
    src: "/images/Machupicchu.jpg", 
    alt: "Machu Picchu",
    fallback: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1920&q=80"
  },
}) {
  const [imgSrc, setImgSrc] = useState(background.src);

  return (
    <section
      className="
        relative isolate
        -mt-16 md:-mt-20
        min-h-[100svh]
        flex items-center justify-center text-center
        text-white overflow-hidden
      "
    >
      {/* Fondo con img nativa y fallback */}
      <div className="absolute inset-0 -z-10">
        <img
          src={imgSrc}
          alt={background.alt || "Fondo Perú Mysterious"}
          className="w-full h-full object-cover"
          onError={() => {
            if (background.fallback) {
              setImgSrc(background.fallback);
            }
          }}
        />
      </div>

      {/* Capas para contraste */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-5xl px-4">
        <header className="mb-10">
          <h1
            className="
              font-russo-one text-5xl md:text-7xl font-bold leading-tight
              text-white drop-shadow-xl
              [text-shadow:_0_0_10px_rgba(219,164,0,0.7),_0_0_20px_rgba(219,164,0,0.5)]
            "
          >
            Descubre los misterios del Perú
          </h1>
          <p className="font-metropolis text-lg md:text-2xl max-w-3xl mx-auto mt-6 text-white/90 leading-relaxed">
            Embárcate en un viaje inolvidable a través de ruinas antiguas,
            culturas vibrantes y paisajes impresionantes
          </p>
        </header>

        {/* Acciones */}
        <div className="w-full flex flex-col items-center space-y-4">
          {/* Buscador + Bot */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
            {/* Buscador */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 flex items-center w-full md:w-auto shadow-lg border border-white/10">
              <div className="pl-3 flex flex-col text-left">
                <label htmlFor="destination" className="text-xs text-gray-500">
                  A dónde vas:
                </label>
                <input
                  id="destination"
                  type="text"
                  placeholder="Ingresa tu destino"
                  className="w-full bg-transparent text-black focus:outline-none text-sm placeholder-black/50"
                />
              </div>
              <button className="ml-2 bg-pm-gold text-white font-bold px-6 py-2 rounded-md hover:bg-pm-gold/90 transition-colors">
                Ir
              </button>
            </div>

            {/* Bot IA */}
            <button
              className="
                group relative isolate
                w-14 h-14 md:w-16 md:h-16 rounded-full
                bg-white/95 backdrop-blur-sm border border-white/10 shadow-lg
                flex items-center justify-center
                transition-transform hover:scale-105 focus:scale-105
              "
              title="Conversa con MysterBot IA"
              aria-label="Conversa con MysterBot IA"
            >
              <span className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md bg-pm-gold/30" />
              <svg viewBox="0 0 64 64" className="w-8 h-8 md:w-9 md:h-9" aria-hidden="true">
                <defs>
                  <linearGradient id="botFace" x1="0" x2="1">
                    <stop offset="0%" stopColor="#111827" />
                    <stop offset="100%" stopColor="#1f2937" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="10" r="3" fill="#E5A400" />
                <rect x="31" y="12" width="2" height="6" fill="#E5A400" />
                <rect x="14" y="20" width="36" height="26" rx="12" fill="url(#botFace)" stroke="#E5E7EB" strokeOpacity="0.15" />
                <circle cx="26" cy="33" r="4" fill="#fff" />
                <circle cx="38" cy="33" r="4" fill="#fff" />
                <circle cx="26" cy="33" r="2" fill="#111827" />
                <circle cx="38" cy="33" r="2" fill="#111827" />
                <path d="M24 39c2.5 3 13.5 3 16 0" stroke="#E5A400" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span
                className="
                  absolute left-1/2 -translate-x-1/2 top-[110%]
                  text-xs bg-black/80 text-white px-2 py-1 rounded-md
                  opacity-0 group-hover:opacity-100 transition-opacity
                  pointer-events-none whitespace-nowrap
                "
              >
                Conversa con MysterBot IA
              </span>
            </button>
          </div>

          {/* Botón principal */}
          <button className="bg-pm-gold text-white font-bold font-russo-one px-10 py-3 rounded-xl hover:bg-pm-gold/90 transition-colors shadow-lg border border-white/10">
            Explorar Destinos
          </button>
        </div>
      </div>
    </section>
  );
}
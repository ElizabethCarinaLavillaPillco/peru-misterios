import { useEffect, useMemo, useState } from "react";

export default function DetailGallery({ fotos = [] }) {
  // Fallback mínimo y relleno hasta 4 para la grilla
  const safe = fotos.length ? fotos.filter(Boolean) : ["/images/placeholder.jpg"];
  const gridItems = useMemo(() => {
    const base = safe.slice(0, 4);
    // duplica si hay menos de 4
    return base.concat(base).slice(0, 4);
  }, [safe]);

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0); // índice en "safe" (todas las fotos disponibles)

  const total = safe.length;

  const openAt = (gridIndex) => {
    // mapear el índice de la grilla al índice real (si hay menos de 4, repite)
    const real = gridIndex % total;
    setIdx(real);
    setOpen(true);
  };

  const go = (dir) => {
    setIdx((i) => {
      if (!total) return 0;
      const n = (i + dir + total) % total;
      return n;
    });
  };

  // Cerrar con ESC y flechas para navegar
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, total]);

  return (
    <>
      <section
        className="
          rounded-2xl border border-amber-600/60 bg-white shadow-sm p-4
        "
        aria-label="Galería de imágenes del destino"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gridItems.map((src, i) => (
            <button
              type="button"
              key={`${src}-${i}`}
              onClick={() => openAt(i)}
              className={`
                group relative overflow-hidden rounded-xl focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#E5A400]/60
                ${i === 0 ? "md:col-span-2 md:row-span-2 h-64 md:h-80" : "h-40"}
              `}
              aria-label={`Ver imagen ${((i % total) + 1)} en grande`}
            >
              <img
                src={src}
                alt={`Foto ${((i % total) + 1)} del destino`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {/* overlay sutil en hover */}
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {open && total > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
          className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm"
          onMouseDown={(e) => {
            // cierra si se hace click en backdrop (no en el contenido)
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Cinta superior con cerrar y contador */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-amber-600/70 bg-white/95 px-4 py-1 text-sm font-semibold text-pm-black hover:bg-white transition"
              aria-label="Cerrar visor"
            >
              Cerrar
            </button>
            <span className="rounded-full bg-[var(--pm-gold,#E5A400)] px-3 py-1 text-sm font-bold text-black">
              {idx + 1} / {total}
            </span>
          </div>

          {/* Imagen centrada */}
          <div className="relative mx-auto grid h-full w-full max-w-6xl place-items-center px-4 pb-10">
            <figure className="relative w-full aspect-[16/10] max-h-[75vh] animate-in fade-in-50">
              <img
                key={safe[idx]} // fuerza fade on change
                src={safe[idx]}
                alt={`Imagen ${idx + 1} ampliada`}
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
              />
            </figure>

            {/* Controles prev/next */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-pm-black shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/60"
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-pm-black shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/60"
                  aria-label="Siguiente imagen"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
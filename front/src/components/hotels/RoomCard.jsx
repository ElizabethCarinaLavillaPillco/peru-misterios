import React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ====== Iconos SVG mejorados (definen tamaño con w/h) ====== */
const CloseIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
  </svg>
);

const ChevronBackIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="48"
      d="M328 112L184 256l144 144"
    />
  </svg>
);

const ChevronForwardIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="48"
      d="M184 112l144 144-144 144"
    />
  </svg>
);

/* ====== Utils ====== */
function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [locked]);
}

function usePreloadImages(urls, active) {
  const [loaded, setLoaded] = useState(() => new Set());
  useEffect(() => {
    if (!active || !urls?.length) return;
    let mounted = true;
    urls.forEach((src) => {
      if (!src) return;
      const im = new Image();
      im.src = src;
      im.onload = () => mounted && setLoaded((s) => new Set(s).add(src));
      im.onerror = () => mounted && setLoaded((s) => new Set(s).add(src));
    });
    return () => {
      mounted = false;
    };
  }, [urls, active]);
  return loaded;
}

/* ====== Componente ====== */
export default function RoomCard({
  name,
  type,
  images = [],
  priceUSD,
  bedType,
  occupancy,
  includes = [],
  hasPrivateBathroom = false,
  hasTV = false,
  includesBreakfast = false,
}) {
  const cover = images?.[0];

  /* Modal */
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  /* Slides */
  const slides = useMemo(
    () => (images?.length ? images : cover ? [cover] : []),
    [images, cover]
  );
  const total = slides.length;
  const [idx, setIdx] = useState(0);

  /* Preload */
  const loadedSet = usePreloadImages(slides, open);

  /* Autoplay */
  const timerRef = useRef(null);
  const hoverRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAutoplay = () => {
    clearTimer();
    if (!open || total <= 1) return;
    timerRef.current = setInterval(() => {
      if (hoverRef.current || document.hidden) return;
      setIdx((i) => (i + 1) % total);
    }, 4000);
  };

  useEffect(() => {
    if (open && total > 1) startAutoplay();
    else clearTimer();
    return clearTimer;
  }, [open, total]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) clearTimer();
      else startAutoplay();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [open, total]);

  /* Teclado */
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (total > 1) {
        if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
        if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  /* Swipe táctil */
  const touchStartX = useRef(0);
  const touchDiff = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDiff.current = 0;
  };
  const handleTouchMove = (e) => {
    touchDiff.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    const THRESHOLD = 50; // px
    if (touchDiff.current > THRESHOLD) setIdx((i) => (i - 1 + total) % total);
    else if (touchDiff.current < -THRESHOLD) setIdx((i) => (i + 1) % total);
  };

  return (
    <>
      {/* ===== Card ===== */}
      <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-sm">
        <div className="relative">
          {cover ? (
            <img
              src={cover}
              alt={name || "Habitación"}
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-56 w-full bg-neutral-200" />
          )}
          {type && (
            <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
              {type}
            </span>
          )}
        </div>

        <div className="p-5 text-neutral-900">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="text-right">
              <div className="font-bold text-amber-600">${priceUSD}</div>
              <div className="text-xs text-neutral-500">/ noche</div>
            </div>
          </div>

          <ul className="mt-3 grid grid-cols-2 gap-y-1 text-sm text-neutral-700 md:grid-cols-3">
            {bedType && <li>🛏️ {bedType}</li>}
            {occupancy && <li>👥 {occupancy}</li>}
            {hasPrivateBathroom && <li>🚿 Baño privado</li>}
            {hasTV && <li>📺 TV</li>}
            {includesBreakfast && <li>🍳 Desayuno</li>}
          </ul>

          {includes?.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {includes.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-amber-200/70 bg-amber-50 px-3 py-1 text-amber-900"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex gap-3">
            <a
              href="#reserva"
              className="rounded-xl bg-amber-700 px-4 py-2 font-semibold text-black transition hover:bg-amber-500"
            >
              Reservar
            </a>
            <button
              type="button"
              onClick={() => {
                setIdx(0);
                setOpen(true);
              }}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-neutral-900 hover:bg-neutral-100"
            >
              Ver más
            </button>
          </div>
        </div>
      </div>

      {/* ===== Modal (Portal) ===== */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[1px]"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cerrar */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-40 grid h-11 w-11 place-items-center rounded-full bg-black/80 text-white shadow-lg ring-1 ring-white/30 hover:bg-black focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Cerrar"
              >
                <CloseIcon className="h-6 w-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Carrusel */}
                <div className="relative md:col-span-3">
                  <div
                    className="relative overflow-hidden bg-neutral-100"
                    onMouseEnter={() => (hoverRef.current = true)}
                    onMouseLeave={() => (hoverRef.current = false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${idx * 100}%)` }}
                    >
                      {total === 0 ? (
                        <div className="flex h-[56vh] min-w-full items-center justify-center text-sm text-neutral-500 md:h-[64vh]">
                          Sin imágenes disponibles
                        </div>
                      ) : (
                        slides.map((src, i) => (
                          <div key={i} className="relative min-w-full flex-shrink-0">
                            {/* Fondo oscuro sutil para letterboxing cuando usamos object-contain */}
                            <div className="relative h-[56vh] w-full bg-black md:h-[64vh]">
                              <img
                                src={src}
                                alt={`${name || "Habitación"} - imagen ${i + 1}`}
                                className={`h-full w-full select-none object-contain ${
                                  loadedSet.has(src) ? "opacity-100" : "opacity-0"
                                } transition-opacity duration-300`}
                                draggable={false}
                                loading={i === 0 ? "eager" : "lazy"}
                              />
                              {!loadedSet.has(src) && (
                                <div className="absolute inset-0 animate-pulse bg-neutral-200" />
                              )}
                              {/* Degradados laterales para mejorar contraste de las flechas */}
                              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/40 to-transparent md:block" />
                              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/40 to-transparent md:block" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Controles */}
                    {total > 1 && (
                      <>
                        {/* Prev */}
                        <button
                          onClick={() => setIdx((i) => (i - 1 + total) % total)}
                          className="group absolute left-2 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/80 p-3 text-white shadow-xl ring-1 ring-white/30 hover:bg-black focus:outline-none focus:ring-2 focus:ring-amber-400"
                          aria-label="Anterior"
                        >
                          <ChevronBackIcon className="h-7 w-7" />
                        </button>

                        {/* Next */}
                        <button
                          onClick={() => setIdx((i) => (i + 1) % total)}
                          className="group absolute right-2 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/80 p-3 text-white shadow-xl ring-1 ring-white/30 hover:bg-black focus:outline-none focus:ring-2 focus:ring-amber-400"
                          aria-label="Siguiente"
                        >
                          <ChevronForwardIcon className="h-7 w-7" />
                        </button>

                        {/* Dots */}
                        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-40 flex justify-center gap-2">
                          {slides.map((_, i) => (
                            <button
                              key={`dot-${i}`}
                              aria-label={`Ir a la imagen ${i + 1}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIdx(i);
                              }}
                              className={`pointer-events-auto h-3 w-3 rounded-full ring-2 ring-white/70 transition ${
                                i === idx
                                  ? "bg-white"
                                  : "bg-white/50 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Info lateral */}
                <div className="flex flex-col gap-4 p-5 md:col-span-2">
                  <div>
                    <h4 className="text-lg font-extrabold text-neutral-900">{name}</h4>
                    <p className="text-sm text-neutral-600">
                      Detalles y servicios seleccionados para tu descanso.
                    </p>
                  </div>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-neutral-800">
                    {bedType && (
                      <li className="rounded-lg border border-neutral-200 bg-white/60 p-2">
                        🛏️ {bedType}
                      </li>
                    )}
                    {occupancy && (
                      <li className="rounded-lg border border-neutral-200 bg-white/60 p-2">
                        👥 {occupancy}
                      </li>
                    )}
                    {hasPrivateBathroom && (
                      <li className="rounded-lg border border-neutral-200 bg-white/60 p-2">
                        🚿 Baño privado
                      </li>
                    )}
                    {hasTV && (
                      <li className="rounded-lg border border-neutral-200 bg-white/60 p-2">
                        📺 TV pantalla plana
                      </li>
                    )}
                    {includesBreakfast && (
                      <li className="rounded-lg border border-neutral-200 bg-white/60 p-2">
                        🍳 Desayuno incluido
                      </li>
                    )}
                  </ul>
                  {includes?.length > 0 && (
                    <div>
                      <h5 className="mb-2 text-sm font-bold text-amber-700">
                        Esta habitación incluye
                      </h5>
                      <ul className="flex flex-wrap gap-2 text-xs">
                        {includes.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-900"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto flex gap-2">
                    <a
                      href="#reserva"
                      className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"
                    >
                      Reservar
                    </a>
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-50"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

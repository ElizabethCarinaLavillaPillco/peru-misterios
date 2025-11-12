import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronBack, IoChevronForward, IoLocationOutline } from "react-icons/io5";

const PEN = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

/* ---------- Card ---------- */
function Card({ item = {} }) {
  const {
    id,
    img = "/images/placeholder.jpg",
    titulo = "Destino",
    resumen = "",
    ciudad,
    precio = 0,
  } = item;

  return (
    <article
      className="
        snap-start
        min-w-[280px] max-w-[320px]
        overflow-hidden rounded-2xl bg-white
        border border-amber-200/60 shadow-sm
        transition-transform duration-300 hover:-translate-y-1 hover:shadow-md
        focus-within:-translate-y-1
      "
    >
      {/* Imagen */}
      <div className="relative aspect-[16/10]">
        <img
          src={img}
          alt={titulo}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col">
        <h3 className="font-russo text-base text-pm-black leading-tight line-clamp-2">
          {titulo}
        </h3>
        {resumen && (
          <p className="mt-2 text-sm text-pm-gray-dark/90 line-clamp-3">
            {resumen}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between text-sm">
          {ciudad ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-white px-2 py-1 text-pm-black">
              <IoLocationOutline size={16} />
              {ciudad}
            </span>
          ) : <span />}
          <span className="font-semibold text-pm-black">{PEN.format(precio)}</span>
        </div>

         <Link
          to={`/destinos/${id}`}
          className="
            mt-4 inline-flex items-center justify-center rounded-full
            !bg-[#E5A400] px-5 py-2.5 text-sm font-bold !text-[#1E1E1E]
            border border-[#AA7600]/60 shadow-md
            mix-blend-normal filter-none
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white
            select-none touch-manipulation
            transform-gpu will-change-transform
            motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out
            motion-safe:hover:bg-[#DBA400]
            motion-safe:active:scale-[0.98]
          "
          aria-label={`Ver más sobre ${titulo}`}
        >
          <span
            className="
              inline-flex items-center gap-2
              motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out
              motion-safe:group-hover:translate-x-[1px]
            "
          >
            Ver más
            {/* flechita opcional, si no usas icono, puedes borrar este SVG */}
            <svg
              className="size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-[2px]"
              viewBox="0 0 24 24" fill="none" aria-hidden="true"
            >
              <path d="M8 5l7 7-7 7" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>

      </div>
    </article>
  );
}

/* ---------- Carrusel ---------- */
export default function RelatedPosts({ items = [] }) {
  const scroller = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scroller.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", onResize);
    };
  }, [items.length]);

  const scroll = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const delta = (dir === "left" ? -1 : 1) * Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Teclado: ← → en el contenedor
  const onKey = (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); scroll("left"); }
    if (e.key === "ArrowRight") { e.preventDefault(); scroll("right"); }
  };

  if (!items.length) return null;

  return (
    <section
      className="rounded-2xl border border-amber-200/60 bg-white shadow-sm p-4 md:p-6"
      aria-labelledby="rel-posts-title"
    >
      <h2
        id="rel-posts-title"
        className="font-russo text-xl md:text-2xl tracking-wide text-center text-pm-black mb-4"
      >
        Posts relacionados
      </h2>

      <div className="relative">
        {/* Degradés laterales */}
        {canLeft && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent rounded-l-2xl"
          />
        )}
        {canRight && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent rounded-r-2xl"
          />
        )}

        {/* Flechas */}
        <button
          onClick={() => scroll("left")}
          disabled={!canLeft}
          className="
            absolute -left-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center
            rounded-full border border-amber-200/60 bg-white/95 shadow
            hover:bg-amber-50 disabled:opacity-40
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/60
          "
          aria-label="Anterior"
        >
          <IoChevronBack />
        </button>

        <button
          onClick={() => scroll("right")}
          disabled={!canRight}
          className="
            absolute -right-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center
            rounded-full border border-amber-200/60 bg-white/95 shadow
            hover:bg-amber-50 disabled:opacity-40
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/60
          "
          aria-label="Siguiente"
        >
          <IoChevronForward />
        </button>

        {/* Scroller */}
        <div
          ref={scroller}
          role="listbox"
          aria-label="Carrusel de posts relacionados"
          tabIndex={0}
          onKeyDown={onKey}
          className="
            flex gap-4 overflow-x-auto scroll-smooth px-2 py-1
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            snap-x snap-mandatory
          "
        >
          {items.map((it) => (
            <Card key={it.id} item={it} />
          ))}
        </div>
      </div>
    </section>
  );
}
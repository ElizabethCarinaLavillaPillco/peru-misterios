import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const PEN = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

export default function DestinoCard({ item = {} }) {
  const {
    id,
    titulo,
    resumen,
    ciudad,
    precio = 0,
    img = "/images/placeholder.jpg",
    badge,        // opcional: "Top", "Nuevo", etc.
    diasLabel,    // opcional: "3–5 días"
    regionLabel,  // opcional: "Cusco, Perú" (si difiere de ciudad)
  } = item;

  return (
    <article
      className="
        group relative flex flex-col overflow-hidden
        rounded-2xl bg-white shadow-sm
        border border-amber-200/60
        transition-transform duration-300 hover:-translate-y-1 hover:shadow-md
        focus-within:-translate-y-1
      "
    >
      {/* Imagen */}
      <div className="relative w-full aspect-[16/10]">
        <img
          src={img}
          alt={titulo}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Degradado claro para legibilidad */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />

        {/* Badge (opcional) */}
        {badge && (
          <span
            className="
              absolute left-3 top-3 rounded-full
              bg-[var(--pm-gold,#E5A400)] px-3 py-1
              text-xs font-extrabold text-black shadow
            "
          >
            {badge}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Título */}
        <h3 className="font-russo text-lg text-pm-black tracking-wide">
          {titulo}
        </h3>

        {/* Meta: ubicación / días */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          {(regionLabel || ciudad) && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-white px-2 py-1 text-pm-black">
              <IoLocationOutline size={16} />
              {regionLabel || ciudad}
            </span>
          )}
          {diasLabel && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-900/70 bg-white px-2 py-1 text-pm-black">
              {diasLabel}
            </span>
          )}
        </div>

        {/* Resumen */}
        {resumen && (
          <p className="mt-3 text-sm text-pm-gray-dark/90 line-clamp-4">
            {resumen}
          </p>
        )}

        {/* Precio + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-pm-black">{PEN.format(precio)}</span>

          <Link
            to={`/destinos/${id}`}
            aria-label={`Ver más sobre ${titulo}`}
            className="
              relative group
              inline-flex items-center justify-center
              rounded-full
              bg-[#E5A700]/30
              px-4 py-2
              text-sm font-bold
              text-[#1E1E1E]
              shadow
              focus-visible:outline-none 
              focus-visible:ring-2
              focus-visible:ring-[#E5A800]/100
            "
          >
            <span className="relative z-10">Ver más</span>
            {/* Subrayado animado */}
            <span
              className="
                pointer-events-none absolute bottom-1 left-4 right-4
                h-[2px] bg-[#1E1E1E]/70 origin-left scale-x-0
                transition-transform duration-200 ease-out
                group-hover:scale-x-100
              "
            />
          </Link>

        </div>
      </div>
    </article>
  );
}
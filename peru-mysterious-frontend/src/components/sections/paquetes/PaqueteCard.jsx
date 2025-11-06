import { Link } from "react-router-dom";

// Reemplazar <Image> por <img>
// Cambiar href por to en <Link>
function Rating({ value = 4.8 }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      <span>{value.toFixed(1)}</span>
      <span className="leading-none">{"★".repeat(full)}{"★".repeat(5-full)}</span>
    </div>
  );
}

export default function PaqueteCard({ item }) {
  // item: { slug, titulo, imagen, dias, noches, idioma, dificultad, max, desde, ciudad, categoria, rating }
  return (
    <article
      className="h-full flex flex-col bg-white rounded-2xl border border-[var(--pm-gold,#E5A400)]/25
                 shadow-sm overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Media */}
      <div className="relative aspect-[16/10]">
        <Image src={item.imagen} alt={item.titulo} fill className="object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          {item.categoria && (
            <span className="rounded-full bg-[var(--pm-gold,#E5A400)] text-black text-xs font-bold px-2 py-0.5 shadow capitalize">
              {item.categoria}
            </span>
          )}
          {item.ciudad && (
            <span className="rounded-full bg-black/70 text-white text-xs px-2 py-0.5">
              {item.ciudad}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-2 py-1 border border-black/5">
          <Rating value={item.rating ?? 4.8} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Título */}
        <h3 className="font-russo text-xl text-[var(--pm-black,#1E1E1E)] leading-tight line-clamp-2">
          {item.titulo}
        </h3>

        {/* Meta fila 1 */}
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-[var(--pm-gray-dark,#373435)]">
          <div className="truncate">
            {item.dias}{item.noches ? ` / ${item.noches} noches` : ""}
          </div>
          <div className="text-right">Máx: {item.max} personas</div>
        </div>

        {/* Meta fila 2 */}
        <div className="mt-1 grid grid-cols-2 gap-3 text-sm">
          <div className="text-[var(--pm-gray-dark,#373435)] truncate">{item.idioma}</div>
          <div className="text-right">
            <span className="inline-flex items-center rounded-full bg-[#F4F4F4] px-2 py-0.5 text-[var(--pm-black,#1E1E1E)]">
              {item.dificultad}
            </span>
          </div>
        </div>

        {/* Precio + CTAs (anclado abajo) */}
        <div className="mt-auto pt-4 border-t border-[var(--pm-gold,#E5A400)]/20">
          <div className="grid gap-3 sm:grid-cols-[1fr,auto] sm:items-center">
            {/* Precio */}
            <div className="text-sm text-[var(--pm-gray-dark,#373435)] leading-tight">
              <div>Desde</div>
              <div className="font-russo text-2xl text-[var(--pm-black,#1E1E1E)]">
                S/ {item.desde}
                <span className="ml-1 align-middle text-sm font-metropolis hidden sm:inline">
                  por persona
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Link
                href={`/paquetes/${item.slug}`}
                className="
                  inline-flex items-center justify-center whitespace-nowrap shrink-0
                  rounded-full bg-[var(--pm-gold,#E5A400)]
                  px-4 py-2 text-sm font-bold !text-black shadow
                  hover:brightness-110 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-gold,#E5A400)]
                  min-w-[120px]
                "
                aria-label={`Ver más detalles de ${item.titulo}`}
              >
                Ver detalles
              </Link>

              <Link
                href={`/contacto?paquete=${encodeURIComponent(item.slug)}`}
                className="
                  inline-flex items-center justify-center whitespace-nowrap shrink-0
                  rounded-full border border-[var(--pm-gold,#E5A400)]
                  px-4 py-2 text-sm font-bold
                  text-[var(--pm-black,#1E1E1E)]
                  hover:bg-[var(--pm-gold,#E5A400)] hover:text-black transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-gold,#E5A400)]
                  min-w-[120px]
                "
              >
                Reservar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

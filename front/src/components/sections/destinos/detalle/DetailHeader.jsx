import { Link } from "react-router-dom";
import {
  IoCalendarOutline,
  IoTrailSignOutline,
  IoPricetagOutline,
  IoStar,
  IoStarHalf,
  IoShieldCheckmarkOutline,
  IoChatbubblesOutline,
} from "react-icons/io5";

const PEN = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

export default function DetailHeader({
  item = {},
  onReserve,               // opcional: callback para reservar (si no, usa Link)
  onContact,               // opcional: callback para asesor (si no, usa Link/wa)
  contactHref = "/contacto",
}) {
  const {
    titulo = "Destino",
    ciudad,
    dias = 1,
    dificultad = "Moderada",
    precio = 0,
    rating = 5,            // 0–5 (puede ser decimal)
    reviews = 2100,        // número de reservas/reviews
  } = item;

  // estrellas visuales (0.5 steps)
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  const MetaChip = ({ icon, children }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-white px-3 py-1.5 text-sm text-pm-black">
      {icon}
      {children}
    </span>
  );

  return (
    <header
      className="
        rounded-2xl border border-amber-200/60 bg-white shadow-sm
        p-5 md:p-6
      "
    >
      {/* Título */}
      <h1 className="font-russo text-2xl md:text-3xl tracking-wide text-pm-black">
        {titulo} {ciudad ? <span className="text-pm-gray-dark/80">— {ciudad}</span> : null}
      </h1>

      {/* Rating + resumen */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-[#E9A500]">
          {Array.from({ length: full }).map((_, i) => (
            <IoStar key={`f-${i}`} size={16} aria-hidden="true" />
          ))}
          {half === 1 && <IoStarHalf size={16} aria-hidden="true" />}
          {Array.from({ length: empty }).map((_, i) => (
            <IoStar key={`e-${i}`} size={16} className="opacity-30" aria-hidden="true" />
          ))}
        </div>
        <span className="text-pm-black/80">
          <b>{Number(reviews).toLocaleString("es-PE")}</b> reservas
        </span>
      </div>

      {/* Metadatos principales */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <MetaChip icon={<IoCalendarOutline size={18} />}>
          {dias} {dias === 1 ? "día" : "días"}
        </MetaChip>
        <MetaChip icon={<IoTrailSignOutline size={18} />}>{dificultad}</MetaChip>
        <MetaChip icon={<IoPricetagOutline size={18} />}>
          Desde <b className="ml-1">{PEN.format(precio)}</b>
        </MetaChip>
      </div>

      {/* CTAs */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Reservar ahora */}
        {onReserve ? (
  <button
    onClick={onReserve}
    className="
      relative isolate group
      inline-flex items-center justify-center
      rounded-full
      bg-[#E5A400]
      px-6 py-2.5
      text-sm font-bold
      !text-[#1E1E1E]
    "
    style={{ color: '#1E1E1E' }}
    aria-label="Reservar ahora"
  >
    <span className="relative z-10">Reservar ahora</span>
    {/* Subrayado animado */}
    <span
      className="
        pointer-events-none absolute bottom-1 left-5 right-5
        h-[2px] bg-[#1E1E1E]/70 origin-left scale-x-0
        motion-safe:transition-transform motion-safe:duration-200
        group-hover:scale-x-100
      "
    />
  </button>
) : (
  <Link
    to="/pagos"
    className="
      relative isolate group
      inline-flex items-center justify-center
      rounded-full
      bg-[#E5A400]
      px-6 py-2.5
      text-sm font-bold
      !text-[#1E1E1E]
    "
    style={{ color: '#1E1E1E' }}
    aria-label="Reservar ahora"
  >
    <span className="relative z-10">Reservar ahora</span>
    {/* Subrayado animado */}
    <span
      className="
        pointer-events-none absolute bottom-1 left-5 right-5
        h-[2px] bg-[#1E1E1E]/70 origin-left scale-x-0
        motion-safe:transition-transform motion-safe:duration-200
        group-hover:scale-x-100
      "
    />
  </Link>
)}

        {/* Hablar con un asesor */}
        {onContact ? (
          <button
            onClick={onContact}
            className="
              inline-flex items-center justify-center gap-2
              rounded-full border border-pm-gold px-6 py-2.5
              text-sm font-semibold text-pm-gold hover:bg-pm-gold hover:text-black
              transition
            "
          >
            <IoChatbubblesOutline size={18} />
            Hablar con un asesor
          </button>
        ) : (
          <Link
            to={contactHref}
            className="
              inline-flex items-center justify-center gap-2
              rounded-full border border-pm-gold px-6 py-2.5
              text-sm font-semibold text-pm-gold hover:bg-pm-gold hover:text-black
              transition
            "
            aria-label="Hablar con un asesor"
          >
            <IoChatbubblesOutline size={18} />
            Hablar con un asesor
          </Link>
        )}
      </div>

      {/* Confianza / garantías */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-pm-gray-dark/90">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-white px-3 py-1">
          <IoShieldCheckmarkOutline size={16} />
          Cancelación flexible
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-white px-3 py-1">
          Soporte 24/7
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-white px-3 py-1">
          Operador local certificado
        </span>
      </div>
    </header>
  );
}
import Link from "next/link";

export default function PlanificarViajeCta() {
  return (
    <div className="rounded-3xl border border-[var(--pm-gold,#E5A400)]/30 bg-white shadow-sm p-6 sm:p-8">
      <div className="text-center max-w-3xl mx-auto">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-[var(--pm-gold,#E5A400)]/25 flex items-center justify-center">
          <span className="font-russo">📍</span>
        </div>
        <h2 className="font-russo text-3xl text-[var(--pm-black,#1E1E1E)]">
          Empieza a planificar tu viaje
        </h2>
        <p className="mt-2 text-[var(--pm-gray-dark,#373435)]">
          Te ayudamos a armar un itinerario a medida: fechas, hoteles, traslados y experiencias.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Respuesta rápida", "Itinerario personalizado", "Mejores recomendaciones"].map((t) => (
            <span key={t} className="rounded-full border border-[var(--pm-gold,#E5A400)]/30 px-3 py-1 text-sm">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/contacto"
            className="
                  inline-flex items-center justify-center whitespace-nowrap shrink-0
                  rounded-full bg-[var(--pm-gold,#E5A400)]
                  px-4 py-2 text-sm font-bold !text-black shadow
                  hover:brightness-110 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-gold,#E5A400)]
                  min-w-[120px]
                "
          >
            Empezar ahora
          </Link>
          <Link
            href="/paquetes"
            className="rounded-full border border-[var(--pm-gold,#E5A400)] px-5 py-2.5 font-bold
                       text-[var(--pm-black,#1E1E1E)] hover:bg-[var(--pm-gold,#E5A400)] hover:text-black transition"
          >
            Ver paquetes
          </Link>
        </div>

        <p className="mt-3 text-xs text-[var(--pm-gray-dark,#373435)]">
          Sin compromiso. Resolvemos dudas y optimizamos tu presupuesto.
        </p>
      </div>
    </div>
  );
}

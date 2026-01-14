import React from 'react';

export default function PlanificaViaje({
  onStart = () => alert("Abrir chat…"),  // cámbialo por tu handler real
  secondaryHref = "/paquetes",
}) {
  return (
    <section
      className="
        rounded-2xl border border-amber-200/60 bg-white shadow-sm
        p-5 md:p-6 font-metropolis
      "
      aria-labelledby="planifica-title"
    >
      <div
        className="
          relative overflow-hidden rounded-xl
          bg-gradient-to-b from-white to-[#FFF9E8]/60
          p-6 md:p-8 text-center
        "
      >
        {/* Pin flotante */}
        <div
          className="
            absolute -top-0 left-1/2 -translate-x-2/2
            grid place-items-center
          "
          aria-hidden="true"
        >
          <div
            className="
              h-10 w-10 rounded-full bg-[var(--pm-gold,#E5A400)]
              shadow-[0_12px_24px_-10px_rgba(0,0,0,0.25)]
              grid place-items-center
              ring-4 ring-white
            "
          >
            <span className="text-black text-xl">📍</span>
          </div>
        </div>

        {/* Cabecera */}
        <h2
          id="planifica-title"
          className="mt-4 font-russo text-2xl md:text-3xl tracking-wide text-pm-black"
        >
          Empieza a planificar tu viaje
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-pm-gray-dark/90">
          Chatea con un especialista local para diseñar un itinerario a tu medida:
          fechas, hoteles, traslados y experiencias imperdibles.
        </p>

        {/* Highlights */}
        <ul className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <li className="rounded-full border border-amber-200/70 bg-white px-3 py-1.5">
            Respuesta rápida
          </li>
          <li className="rounded-full border border-amber-200/70 bg-white px-3 py-1.5">
            Itinerario personalizado
          </li>
          <li className="rounded-full border border-amber-200/70 bg-white px-3 py-1.5">
            Mejores recomendaciones
          </li>
        </ul>

        {/* CTA */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onStart}
            className="
              rounded-full bg-[var(--pm-gold,#E5A400)] px-6 py-2.5
              text-sm font-bold text-black shadow hover:brightness-110
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/60
              transition
            "
            aria-label="Empezar chat con un especialista"
          >
            Empezar ahora
          </button>

          <a
            href={secondaryHref}
            className="
              rounded-full border border-pm-gold px-6 py-2.5
              text-sm font-semibold text-pm-gold hover:bg-pm-gold hover:text-black
              transition
            "
          >
            Ver paquetes
          </a>
        </div>

        {/* Nota pequeña */}
        <p className="mt-3 text-xs text-pm-gray-dark/80">
          Sin compromiso. Te ayudamos a resolver dudas y optimizar tu presupuesto.
        </p>

        {/* Decoración sutil */}
        <span
          className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-[75%] -translate-x-1/2 rounded-[999px] opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(229,164,0,0.35) 0%, rgba(229,164,0,0.0) 70%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

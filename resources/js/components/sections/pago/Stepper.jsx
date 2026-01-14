import React from 'react';
export default function Stepper({
  current = 1,
  title,        // título opcional
  onGoTo,       // opcional: callback para saltar a un paso
}) {
  const steps = ["Paso 1: Reserva", "Paso 2: Pago"];
  const computedTitle =
    title || (current === 1 ? "Reserva tus Paquetes" : "Selecciona tu método de pago");

  return (
    <div className="w-full mb-2 font-metropolis text-pm-black">
      {/* Contenedor del stepper */}
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-amber-200/40 bg-white/80 backdrop-blur px-4 py-3 shadow-sm">
        {/* Línea de progreso bajo los puntos */}
        <div className="relative">
          <ol
            className="relative z-10 flex items-center justify-center gap-8 text-sm"
            role="listbox"
            aria-label="Progreso de compra"
          >
            {steps.map((s, i) => {
              const stepNum = i + 1;
              const done = stepNum < current;
              const active = stepNum === current;
              const selectable = typeof onGoTo === "function";

              return (
                <li key={s} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectable && onGoTo(stepNum)}
                    aria-label={s}
                    aria-current={active ? "step" : undefined}
                    className={`grid h-7 w-7 place-items-center rounded-full border text-[13px] transition
                      ${active
                        ? "bg-pm-gold text-pm-black border-pm-gold shadow"
                        : done
                        ? "bg-[#fff7e0]/80 text-pm-black border-amber-300/70"
                        : "bg-white text-pm-gray-dark border-amber-200/40"}
                      ${selectable ? "hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pm-gold/50" : ""}
                    `}
                  >
                    {stepNum}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectable && onGoTo(stepNum)}
                    className={`text-left transition
                      ${active ? "font-semibold text-pm-black" : "text-pm-gray-dark"}
                      ${selectable ? "hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-pm-gold/40 rounded" : ""}
                    `}
                  >
                    {s}
                  </button>

                  {i < steps.length - 1 && <span className="mx-2 text-pm-gray-light">•</span>}
                </li>
              );
            })}
          </ol>

          {/* Barra de fondo */}
          <div className="absolute left-0 right-0 top-1/2 -z-0 h-[2px] -translate-y-1/2 bg-amber-200/40 rounded-full" />
          {/* Progreso */}
          <ProgressBar current={current} total={steps.length} />
        </div>
      </div>

      {/* Título de página */}
      <h1 className="mt-4 text-center font-russo text-2xl md:text-3xl text-pm-black">
        {computedTitle}
        <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-pm-gold" />
      </h1>
    </div>
  );
}

/* ----- Subcomponente de progreso ----- */
function ProgressBar({ current, total }) {
  const ratio = Math.max(0, Math.min(1, (current - 1) / (total - 1 || 1)));
  return (
    <div
      className="pointer-events-none absolute left-0 top-1/2 -z-0 h-[2px] -translate-y-1/2 rounded-full"
      style={{
        width: `${ratio * 100}%`,
        background:
          "linear-gradient(90deg, rgba(229,164,0,0.9) 0%, rgba(219,164,0,0.8) 60%, rgba(170,118,0,0.7) 100%)",
      }}
    />
  );
}

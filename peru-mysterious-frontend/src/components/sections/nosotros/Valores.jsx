// src/components/sections/nosotros/Valores.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  IoSparklesOutline,
  IoCheckmarkCircleOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoHeartOutline,
  IoPeopleOutline,
  IoBulbOutline,
} from "react-icons/io5";

const valores = [
  { label: "Excelencia",             Icon: IoSparklesOutline },
  { label: "Compromiso",             Icon: IoCheckmarkCircleOutline },
  { label: "Responsabilidad",        Icon: IoShieldCheckmarkOutline },
  { label: "Puntualidad",            Icon: IoTimeOutline },
  { label: "Pasión por el servicio", Icon: IoHeartOutline },
  { label: "Trabajo en equipo",      Icon: IoPeopleOutline },
  { label: "Honestidad",             Icon: IoShieldCheckmarkOutline },
  { label: "Innovación",             Icon: IoBulbOutline },
];

export default function Valores() {
  const refs = useRef([]);
  const [seen, setSeen] = useState({}); // {index: true}

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-idx"));
            setSeen((s) => ({ ...s, [idx]: true }));
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="max-w-7xl mx-auto px-4 py-10 selection:bg-pm-gold selection:text-black"
      aria-labelledby="valores-title"
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-pm-gold" />
        <h3 id="valores-title" className="text-2xl font-extrabold tracking-wide text-pm-black">
          VALORES
        </h3>
      </div>

      <ul role="list" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {valores.map(({ label, Icon }, i) => (
          <li
            key={label}
            data-idx={i}
            ref={(el) => (refs.current[i] = el)}
            className={`
              group relative rounded-2xl p-[1px]
              bg-gradient-to-br from-pm-gold/20 via-white to-white
              transition-all duration-500
              ${seen[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
              hover:-translate-y-0.5
            `}
          >
            {/* ✨ Halo dorado al hover/focus */}
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0 rounded-2xl
                opacity-0 blur-2xl transition-opacity duration-300
                bg-pm-gold/40
                group-hover:opacity-70
                group-focus-within:opacity-70
              "
            />

            {/* Tarjeta interna */}
            <div
              tabIndex={0}
              className="
                relative z-10 rounded-2xl border border-black/10 bg-white px-4 py-3
                text-pm-black shadow-sm transition-all
                hover:shadow-[0_12px_40px_rgba(229,164,0,.35)]
                focus:outline-none focus:ring-2 focus:ring-pm-gold/70
                group-hover:border-pm-gold/50
              "
            >
              <span className="inline-flex items-center gap-3 font-extrabold">
                <span
                  aria-hidden="true"
                  className="
                    grid h-9 w-9 place-items-center rounded-xl bg-white
                    ring-1 ring-pm-gold/40 transition
                    group-hover:ring-pm-gold/80
                  "
                >
                  <Icon className="h-5 w-5 text-pm-gold" />
                </span>
                {label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

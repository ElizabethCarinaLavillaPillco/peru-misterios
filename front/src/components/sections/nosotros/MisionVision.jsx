import { useEffect, useRef, useState } from "react";
import {
  IoFlagOutline,       // para "Misión"
  IoEyeOutline,        // para "Visión"
  IoSparklesOutline,   // para frase inspiracional
} from "react-icons/io5";

export default function MisionVision() {
  const mRef = useRef(null);
  const vRef = useRef(null);
  const [seen, setSeen] = useState({ m: false, v: false });

  // Animación al entrar en viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (e.target === mRef.current) setSeen((s) => ({ ...s, m: true }));
          if (e.target === vRef.current) setSeen((s) => ({ ...s, v: true }));
        });
      },
      { threshold: 0.2 }
    );
    if (mRef.current) io.observe(mRef.current);
    if (vRef.current) io.observe(vRef.current);
    return () => io.disconnect();
  }, []);

  const outer = `
    rounded-2xl p-[1px]
    bg-gradient-to-br from-pm-gold/20 via-white to-white
  `;

  const card = `
    rounded-2xl border border-black/10 bg-white text-pm-black
    shadow-sm p-6 md:p-7
    transition-all duration-500 will-change-transform
    hover:-translate-y-0.5 hover:shadow-md
    focus-within:ring-2 focus-within:ring-pm-gold/70
  `;

  const enterBase = "opacity-0 translate-y-3";
  const enterDone = "opacity-100 translate-y-0";

  const h2 = "text-xl font-extrabold tracking-tight";
  const pBase = "mt-3 leading-relaxed text-gray-800";
  const quote = "mt-3 text-sm italic text-gray-700";

  const Chip = ({ icon: Icon, children }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
      <Icon className="h-4 w-4 text-pm-gold" />
      {children}
    </span>
  );

  return (
    <section
      aria-label="Misión y Visión"
      className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-6 selection:bg-pm-gold selection:text-black"
    >
      {/* Misión */}
      <div className={outer} ref={mRef}>
        <article
          className={`${card} ${
            seen.m ? enterDone : enterBase
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className={h2}>MISIÓN</h2>
            <Chip icon={IoFlagOutline}>Nuestro propósito</Chip>
          </div>

          <p className={pBase}>
            Nos esforzamos por construir una experiencia diferenciada, con los más
            altos estándares de excelencia en el servicio turístico en Perú.
          </p>
        </article>
      </div>

      {/* Visión */}
      <div className={outer} ref={vRef}>
        <article
          className={`${card} ${
            seen.v ? enterDone : enterBase
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className={h2}>VISIÓN</h2>
            <Chip icon={IoEyeOutline}>Nuestro norte</Chip>
          </div>

          <p className={pBase}>
            Creemos y planeamos una presencia global con una actividad servicial que
            lleve a los usuarios a la máxima satisfacción de viajar, logrando
            posicionarnos entre las 10 compañías más innovadoras del mundo.
          </p>

          <p className={quote}>
            <span className="inline-flex items-center gap-2">
              <IoSparklesOutline className="h-4 w-4 text-pm-gold" />
              “¡Haremos que la historia de tu viaje siempre esté presente por el resto de tus días!”
            </span>
          </p>
        </article>
      </div>
    </section>
  );
}

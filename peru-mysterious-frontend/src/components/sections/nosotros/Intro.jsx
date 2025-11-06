// src/components/sections/nosotros/Intro.jsx
import Image from "next/image";
import Link from "next/link";
import {
  IoShieldCheckmarkOutline,
  IoMapOutline,
  IoSparklesOutline,
} from "react-icons/io5";

export default function Intro() {
  return (
    <section
      aria-labelledby="pm-nosotros-title"
      className="
        max-w-7xl mx-auto px-4 py-10
        selection:bg-pm-gold selection:text-black
      "
    >
      {/* Marco dorado sutil */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-pm-gold/20 via-white to-white">
        {/* Card interna */}
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6 md:p-10 text-pm-black">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Texto */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-pm-gold" />
                Sobre nosotros
              </div>

              <h1
                id="pm-nosotros-title"
                className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                PERÚ MYSTERIOUS
              </h1>
              <p className="mt-1 text-sm font-extrabold text-pm-gold">
                Tour Operator
              </p>

              <p className="mt-6 leading-relaxed text-gray-800">
                Somos una agencia de viajes y turismo inbound en Perú. Nuestros
                especialistas conocen las rutas a la perfección y están a tu
                disposición para crear vacaciones que se adapten a tus
                intereses, calendario y presupuesto. Ubicados en Cusco, somos
                expertos en turismo de aventura, ecológico, místico, cultural y
                vivencial. Ofrecemos experiencias personalizadas, salidas
                compartidas, viajes privados, programas de incentivos y rutas de
                interés especial. Nuestro propósito es crear momentos únicos e
                inolvidables en cada destino.
              </p>

              {/* Chips de valor */}
              <ul className="mt-6 grid gap-3">
                <li className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white ring-1 ring-pm-gold/50">
                    <IoShieldCheckmarkOutline className="h-5 w-5 text-pm-gold" />
                  </span>
                  <div>
                    <p className="font-extrabold leading-tight">
                      Atención confiable
                    </p>
                    <p className="text-sm text-gray-700">
                      Equipo local y acompañamiento antes, durante y después del
                      viaje.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white ring-1 ring-pm-gold/50">
                    <IoMapOutline className="h-5 w-5 text-pm-gold" />
                  </span>
                  <div>
                    <p className="font-extrabold leading-tight">
                      Itinerarios a medida
                    </p>
                    <p className="text-sm text-gray-700">
                      Diseñamos rutas según tus intereses y tiempos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white ring-1 ring-pm-gold/50">
                    <IoSparklesOutline className="h-5 w-5 text-pm-gold" />
                  </span>
                  <div>
                    <p className="font-extrabold leading-tight">
                      Experiencias auténticas
                    </p>
                    <p className="text-sm text-gray-700">
                      Cultura viva, naturaleza y conexiones reales con cada
                      destino.
                    </p>
                  </div>
                </li>
              </ul>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/paquetes"
                  className="
                        inline-flex items-center justify-center rounded-xl
                        bg-pm-gold px-5 py-3 text-sm font-extrabold
                        text-black !text-black     /* ⬅️ fuerza el color del texto */
                        hover:brightness-105 active:brightness-95
                        focus:outline-none focus:ring-2 focus:ring-pm-gold/70
                      "
                >
                  Ver paquetes
                </Link>
                <Link
                  href="/contacto"
                  className="
                    inline-flex items-center justify-center rounded-xl
                    border border-black/10 bg-white px-5 py-3
                    text-sm font-semibold text-pm-black
                    hover:bg-black/5
                    focus:outline-none focus:ring-2 focus:ring-pm-gold/70
                  "
                >
                  Contáctanos
                </Link>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative rounded-2xl overflow-hidden border border-black/10">
              {/* Glow decorativo */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-pm-gold/20 blur-3xl opacity-70"
              />
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/nosotros-hero.jpg" // coloca la imagen en /public/images/
                  alt="Equipo de Perú Mysterious en ruta por los Andes"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                  className="object-cover"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

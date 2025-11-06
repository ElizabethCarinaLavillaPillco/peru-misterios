// components/sections/ayuda/SoporteRapido.jsx
"use client";

import Link from "next/link";
import { IoLogoWhatsapp, IoMailOutline, IoCallOutline } from "react-icons/io5";

const CARDS = [
  {
    title: "Escríbenos por WhatsApp",
    desc: "Respuesta más rápida en horario laboral.",
    icon: IoLogoWhatsapp,
    href: "https://wa.me/51931614600",
    cta: "Abrir WhatsApp",
  },
  {
    title: "Correo de soporte",
    desc: "Envíanos el detalle de tu consulta.",
    icon: IoMailOutline,
    href: "mailto:info@perumysterious.com",
    cta: "Enviar correo",
  },
  {
    title: "Llámanos",
    desc: "+51 931 614 600 (Rosmery) | +51 949 141 112 (Armando)",
    icon: IoCallOutline,
    href: "tel:+51931614600",
    cta: "Llamar",
  },
];

export default function SoporteRapido() {
  return (
    <section
      aria-labelledby="support-title"
      className="
        rounded-2xl p-[1px]
        bg-gradient-to-br from-pm-gold/20 via-white to-white
        selection:bg-pm-gold selection:text-black
      "
    >
      {/* Tarjeta interna (blanca, contraste fijo) */}
      <div
        className="
          rounded-2xl bg-white text-pm-black border border-black/10
          p-6 sm:p-7 shadow-sm
        "
      >
        <h3 id="support-title" className="text-xl font-extrabold">
          ¿Aún necesitas ayuda?
        </h3>
        <p className="text-sm text-gray-700 mt-1">
          Contáctanos por cualquiera de estos canales.
        </p>

        {/* Grid de canales */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ title, desc, icon: Icon, href, cta }) => {
            const isHttp = /^https?:\/\//i.test(href);
            const isMailOrTel = /^(mailto:|tel:)/i.test(href);

            const CardInner = (
              <div
                className="
                  rounded-2xl border border-black/10 bg-white p-5
                  shadow-sm transition-all
                  group-hover:shadow-md group-hover:-translate-y-0.5
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold/70
                "
              >
                <div className="flex items-start gap-3">
                  {/* Icono con aro dorado */}
                  <div
                    className="
                      grid h-10 w-10 place-items-center shrink-0
                      rounded-xl bg-white ring-1 ring-pm-gold/50
                    "
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5 text-pm-gold" />
                  </div>

                  {/* Texto */}
                  <div>
                    <h4 className="font-extrabold leading-tight !text-pm-black">
                      {title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">{desc}</p>
                    <span
                      className="
                        mt-2 inline-flex items-center gap-1 text-sm font-semibold
                        text-pm-gold
                      "
                    >
                      {cta} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </div>
            );

            /* Enlaces externos usan <a>; internos, <Link /> */
            if (isHttp || isMailOrTel) {
              return (
                <a
                  key={title}
                  href={href}
                  aria-label={`${title}. ${desc}`}
                  className="group rounded-2xl block"
                  {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {CardInner}
                </a>
              );
            }

            return (
              <Link
                key={title}
                href={href}
                aria-label={`${title}. ${desc}`}
                className="group rounded-2xl block"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>

        {/* CTA principal */}
        <div className="mt-6">
          <Link
            href="/contacto"
            className="
              inline-flex items-center justify-center rounded-xl
              bg-pm-black px-5 py-3 text-sm font-extrabold text-white
              hover:brightness-105 active:brightness-95
              focus:outline-none focus:ring-2 focus:ring-pm-gold/70
            "
          >
            Ir al formulario de contacto
          </Link>
        </div>

        {/* Metadatos / badges sutiles */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Tiempo de respuesta prioritario por WhatsApp
          </span>
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Soporte en español e inglés
          </span>
        </div>
      </div>
    </section>
  );
}

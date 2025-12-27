import React from "react";
import { Link } from "react-router-dom";
import { IoHelpBuoyOutline } from "react-icons/io5";

const WHATSAPP_URL = "https://wa.me/519999999999"; // ← TODO: reemplaza por tu número

export default function HeroAyuda() {
  return (
    <section
      aria-labelledby="help-center-title"
      className="
        relative rounded-2xl p-[1px]
        bg-gradient-to-br from-pm-gold/20 via-white to-white
      "
    >
      {/* Card interna (blanca, alto contraste) */}
      <div
        className="
          relative rounded-2xl bg-white text-pm-black
          border border-black/10 p-7 lg:p-10
          shadow-sm
        "
      >
        {/* Glow decorativo dorado sutil */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute -top-10 -right-10 h-40 w-40
            rounded-full bg-pm-gold/20 blur-3xl opacity-60
          "
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Título + icono */}
          <div className="flex items-start gap-4">
            <div
              className="
                grid h-12 w-12 place-items-center shrink-0
                rounded-xl bg-white ring-1 ring-pm-gold/50
              "
              aria-hidden="true"
            >
              <IoHelpBuoyOutline className="h-6 w-6 text-pm-gold" />
            </div>

            <div>
              <h1
                id="help-center-title"
                className="text-3xl lg:text-4xl font-extrabold tracking-tight"
              >
                Centro de Ayuda
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                ¿Dudas sobre <strong>reservas</strong>, <strong>pagos</strong> o
                <strong> itinerarios</strong>? Encuentra respuestas rápidas o
                contáctanos para recibir asistencia.
              </p>

              {/* Chips rápidos */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "Reservas", href: "#faq-reserva" },
                  { label: "Pagos", href: "#faq-pago" },
                  { label: "Cancelación", href: "#faq-cancel" },
                  { label: "Equipaje", href: "#faq-equipaje" },
                  { label: "Idiomas", href: "#faq-idiomas" },
                ].map((c) => (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="
                      rounded-full border border-black/10 bg-white
                      px-3 py-1.5 text-xs font-semibold
                      hover:bg-black/5 transition
                      focus:outline-none focus:ring-2 focus:ring-pm-gold/70
                    "
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 lg:pt-1">
            <Link
              href="#faq"
              className="
                inline-flex items-center justify-center rounded-xl
                bg-pm-black px-4 py-2.5 text-sm font-extrabold text-black
                hover:brightness-105 active:brightness-95
                focus:outline-none focus:ring-2 focus:ring-pm-gold/70
              "
            >
              Ver preguntas frecuentes
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center rounded-xl
                border border-black/10 bg-white px-4 py-2.5
                text-sm font-semibold hover:bg-black/5
                focus:outline-none focus:ring-2 focus:ring-pm-gold/70
              "
            >
              Hablar con un asesor
            </a>
          </div>
        </div>

        {/* Meta/ayuda secundaria */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Respuesta rápida por WhatsApp y correo
          </span>
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Soporte en español e inglés
          </span>
        </div>
      </div>
    </section>
  );
}

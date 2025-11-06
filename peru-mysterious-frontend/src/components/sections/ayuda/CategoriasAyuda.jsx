import React from "react";
import { Link } from "react-router-dom";
import {
  IoCalendarOutline,
  IoCardOutline,
  IoAirplaneOutline,
  IoShieldCheckmarkOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";

/** Si no defines href en un item, se construye #faq-{slug-del-titulo} */
const toAnchor = (t) =>
  `#faq-${t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

const CATS = [
  { icon: IoCalendarOutline, title: "Reservas", desc: "Fechas, confirmaciones, cambios.", href: "#faq-reserva" },
  { icon: IoCardOutline, title: "Pagos", desc: "Métodos, recibos, reembolsos.", href: "#faq-pago" },
  { icon: IoAirplaneOutline, title: "Antes del viaje", desc: "Qué llevar, clima, seguros.", href: "#faq-equipaje" },
  { icon: IoShieldCheckmarkOutline, title: "Políticas", desc: "Cancelación, protección al viajero.", href: "#faq-cancel" },
  { icon: IoChatbubbleEllipsesOutline, title: "Contacto", desc: "Cómo hablar con un asesor.", href: "#faq-contacto" },
];

export default function CategoriasAyuda() {
  return (
    <section
      aria-label="Categorías de ayuda"
      className="
        grid gap-4 sm:grid-cols-2 lg:grid-cols-5
        text-pm-black selection:bg-pm-gold selection:text-black
      "
    >
      {CATS.map(({ icon: Icon, title, desc, href }) => {
        const finalHref = href || toAnchor(title);
        return (
          <Link
            key={title}
            href={finalHref}
            aria-label={`${title}: ${desc}`}
            className="
              group relative rounded-2xl p-[1px]
              bg-gradient-to-br from-pm-gold/10 via-white to-white
              transition-transform duration-300 hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold/70
              focus-visible:ring-offset-2 focus-visible:ring-offset-white
            "
          >
            {/* Card interna (blanca con borde y sombra suave) */}
            <div
              className="
                rounded-2xl border border-black/10 bg-white p-5
                shadow-sm hover:shadow-md transition
              "
            >
              <div className="flex items-start gap-3">
                {/* Icono con anillo dorado sutil */}
                <div
                  className="
                    grid h-10 w-10 place-items-center shrink-0
                    rounded-xl bg-white ring-1 ring-pm-gold/40
                    group-hover:ring-pm-gold/70 transition
                  "
                >
                  <Icon className="h-5 w-5 text-pm-gold" />
                </div>

                {/* Texto (contraste fijo) */}
                <div>
                  <h3 className="font-extrabold leading-tight !text-pm-black">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-700">{desc}</p>

                  {/* Indicador sutil */}
                  <span
                    className="
                      mt-3 inline-block text-xs font-semibold
                      text-pm-gold opacity-0 transition-opacity
                      group-hover:opacity-100
                    "
                  >
                    Ver más →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

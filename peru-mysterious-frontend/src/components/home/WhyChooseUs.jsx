"use client";

import React from "react";
import PropTypes from "prop-types";
import {
  IoWalletOutline,
  IoCalendarOutline,
  IoSparklesOutline,
  IoMapOutline,
  IoChatbubbleEllipsesOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

/* ====================== CARD ====================== */
function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-pm-gold/30 bg-white/90 backdrop-blur-[2px] shadow-[0_10px_30px_rgba(0,0,0,.08)] transition-transform duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Golden hover halo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "linear-gradient(135deg, rgba(229,164,0,.12), rgba(219,164,0,.08) 45%, transparent)",
        }}
      />

      <div className="relative z-[1] p-6 md:p-7 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-pm-gold to-pm-gold-dark text-pm-black ring-1 ring-pm-gold/40 shadow-[0_10px_22px_-8px_rgba(229,164,0,.45)]">
          <Icon size={26} />
        </div>

        <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-pm-dark">
          {title}
        </h3>

        <p className="mt-2 text-sm md:text-base font-semibold leading-relaxed text-pm-dark/80">
          {description}
        </p>

        <span className="mx-auto mt-4 block h-[2px] w-10 rounded-full bg-pm-gold/80 transition-all duration-300 group-hover:w-16" />
      </div>
    </article>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

/* ====================== MAIN SECTION ====================== */
export default function WhyChooseUs() {
  const features = [
    {
      icon: IoWalletOutline,
      title: "Mejores precios",
      description:
        "Suscríbete y aprovecha ofertas reales con la mejor relación calidad-precio del mercado.",
    },
    {
      icon: IoCalendarOutline,
      title: "Reservas rápidas y flexibles",
      description:
        "Reserva en 3 pasos, con cambios y cancelación flexibles para adaptarse a tus planes.",
    },
    {
      icon: IoSparklesOutline,
      title: "Experiencias únicas",
      description:
        "Tours cuidados al detalle para que vivas emociones auténticas e inolvidables.",
    },
    {
      icon: IoMapOutline,
      title: "Destinos múltiples",
      description:
        "Conecta varios destinos en un solo viaje y explora el Perú a tu ritmo.",
    },
    {
      icon: IoChatbubbleEllipsesOutline,
      title: "Ayuda inmediata",
      description:
        "Soporte humano y rápido cuando lo necesites: antes, durante y después del tour.",
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: "Plataforma segura",
      description:
        "Pagos y datos protegidos con buenas prácticas y proveedores de confianza.",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      aria-labelledby="porque-peru-mysterious"
    >
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #FFF9EE 0%, #FFF4DA 55%, #FBEED1 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 420px at 10% -10%, rgba(229,164,0,.18), transparent 60%), radial-gradient(700px 420px at 90% 110%, rgba(219,164,0,.16), transparent 60%)",
          }}
        />
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] opacity-25 blur-3xl rounded-full animate-spin motion-reduce:animate-none [animation-duration:60s] [animation-timing-function:linear]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(229,164,0,0), rgba(229,164,0,.35), rgba(219,164,0,0) 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,.18) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="mx-auto mb-12 md:mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-pm-gold/40 bg-pm-gold/15 px-3 py-1 text-xs font-bold text-pm-gold">
            Valor que se nota
            <span className="h-1.5 w-1.5 rounded-full bg-pm-gold" />
          </span>

          <h2
            id="porque-peru-mysterious"
            className="font-russo-one text-3xl md:text-4xl text-pm-dark tracking-tight"
          >
            ¿Por qué con <span className="text-pm-gold">Perú Mysterious</span>?
          </h2>

          <p className="mt-3 text-pm-dark/80 text-base md:text-lg font-extrabold">
            Elegimos lo mejor para ti: precio, flexibilidad, seguridad y
            experiencias que brillan.
          </p>
        </header>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
              delay={i * 60}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 grid place-content-center">
          <a
            href="#destinos"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm md:text-base font-extrabold tracking-tight bg-gradient-to-b from-pm-gold to-pm-gold-dark text-pm-black ring-1 ring-pm-gold/40 shadow-[0_10px_26px_-10px_rgba(229,164,0,.45)] transition hover:brightness-105 active:translate-y-[1px]"
          >
            Explorar destinos
          </a>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

import { Link } from 'react-router-dom';
import { IoCalendarOutline, IoGlobeOutline, IoArrowForward } from "react-icons/io5";

/* Chip/Tag dorado claro */
const Tag = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-amber-200/40 bg-[#fff7e0]/70 px-3 py-1 text-xs font-semibold text-pm-black">
    {children}
  </span>
);

/* Tarjeta pequeña de tour (lado derecho) */
const TourCard = ({ imageUrl, duration, languages, title, price, tourLink }) => (
  <article className="flex flex-col overflow-hidden rounded-2xl border border-amber-200/40 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <div className="relative h-40 w-full">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
    </div>

    <div className="flex flex-grow flex-col p-4 font-metropolis text-pm-black">
      <div className="mb-2 flex items-center gap-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <IoCalendarOutline /> <span>{duration}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <IoGlobeOutline /> <span>{languages}</span>
        </span>
      </div>

      <h4 className="flex-grow font-russo-one text-lg leading-snug text-pm-black">{title}</h4>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-600">Desde</span>
          <p className="font-russo-one text-xl text-pm-black">{price}</p>
        </div>

        <Link
          to={tourLink}
          className="inline-flex items-center gap-1 rounded-full border border-pm-gold/40 bg-white px-3 py-1.5 text-sm font-semibold text-pm-black transition hover:bg-pm-gold/10 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
          aria-label={`Ver tour: ${title}`}
        >
          Ver tour <IoArrowForward />
        </Link>
      </div>
    </div>
  </article>
);

export default function ToursDestacados() {
  const smallTours = [
    {
      imageUrl: "/images/LagunaHumantay2.jpg",
      duration: "7 Días",
      languages: "Inglés / Español",
      title: "Explore Perú en 7 días 6 noches desde Lima",
      price: "$549.00",
      tourLink: "/tours/1",
    },
    {
      imageUrl: "/images/Machupicchu5.jpg",
      duration: "12 Días",
      languages: "Inglés / Español",
      title: "Explore Perú en 12 días 11 noches desde Lima",
      price: "$848.00",
      tourLink: "/tours/2",
    },
    {
      imageUrl: "/images/montana-de-colores.jpg",
      duration: "11 Días",
      languages: "Inglés / Español",
      title: "Explore Perú en 11 días 10 noches desde Lima",
      price: "$899.00",
      tourLink: "/tours/3",
    },
    {
      imageUrl: "/images/Sacsaywaman2.jpg",
      duration: "8 Días",
      languages: "Inglés / Español",
      title: "Explore Perú en 8 días 6 noches desde Lima",
      price: "$509.00",
      tourLink: "/tours/4",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-[#fff7e0]/40 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-10 text-center">
          <h2 className="font-russo-one text-3xl md:text-4xl text-pm-black">Tours Destacados</h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-pm-gold" />
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Tarjeta grande (izquierda) */}
          <article className="relative min-h-[500px] overflow-hidden rounded-2xl border border-amber-200/40 bg-white shadow-md">
            <div className="absolute inset-0 -z-10">
              <img
                src="/images/Machupicchu3.jpg"
                alt="Machu Picchu"
                className="w-full h-full object-cover"
              />
            </div>
            {/* overlay para legibilidad */}
            <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white md:p-8">
              <div className="space-y-2">
                <Tag>Tour destacado</Tag>
                <h3 className="font-russo-one text-3xl md:text-4xl">Machupicchu Maravilla del Mundo</h3>
              </div>

              <div className="my-4 max-w-xl text-sm leading-relaxed text-white/95 md:text-base">
                A pesar de que el propósito exacto de Machu Picchu aún no se ha determinado con
                certeza, se cree que pudo haber sido un centro ceremonial, religioso y político.
                En 1983, fue declarado Patrimonio de la Humanidad por la UNESCO…
              </div>

              <div className="flex flex-wrap gap-2">
                <Tag>Todo incluido</Tag>
                <Tag>Cultural</Tag>
                <Tag>Aventura</Tag>
              </div>

              <Link
                to="/tours/machu-picchu"
                className="mt-4 inline-flex w-auto items-center justify-center gap-2 rounded-full bg-pm-gold px-5 py-2.5 font-semibold text-pm-black shadow hover:brightness-110 hover:-translate-y-0.5 transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                Ver más detalles <IoArrowForward />
              </Link>
            </div>
          </article>

          {/* Grid de 4 tarjetas pequeñas (derecha) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {smallTours.map((tour) => (
              <TourCard key={tour.title} {...tour} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
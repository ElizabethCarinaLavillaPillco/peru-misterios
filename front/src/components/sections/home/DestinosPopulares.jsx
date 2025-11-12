// src/components/home/DestinosPopulares.jsx

import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Flecha siguiente
const NextArrow = ({ onClick }) => (
  <button
    type="button"
    aria-label="Siguiente"
    onClick={onClick}
    className="absolute top-1/2 right-0 md:-right-8 -translate-y-1/2 z-10
               grid h-11 w-11 place-items-center rounded-full
               bg-white/15 ring-1 ring-white/40 backdrop-blur
               hover:bg-white/25 hover:ring-pm-gold transition"
  >
    <IoChevronForward size={22} className="text-white" />
  </button>
);

// Flecha anterior
const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    aria-label="Anterior"
    onClick={onClick}
    className="absolute top-1/2 left-0 md:-left-8 -translate-y-1/2 z-10
               grid h-11 w-11 place-items-center rounded-full
               bg-white/15 ring-1 ring-white/40 backdrop-blur
               hover:bg-white/25 hover:ring-pm-gold transition"
  >
    <IoChevronBack size={22} className="text-white" />
  </button>
);

export default function DestinosPopulares({ background }) {
  const destinos = [
    { name: "Cusco", imageUrl: "/images/CuscoCatedral.jpg", href: "/destinos/cusco" },
    { name: "Huánuco", imageUrl: "/images/LagunaHumantay.jpg", href: "/destinos/huanuco" },
    { name: "Ica", imageUrl: "/images/Machupicchu4.jpg", href: "/destinos/ica" },
    { name: "Arequipa", imageUrl: "/images/Waqrapukara.jpg", href: "/destinos/arequipa" },
    { name: "Lima", imageUrl: "/images/Maras.jpg", href: "/destinos/lima" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="relative py-20 text-white">
      {/* Fondo dinámico */}
      <div className="absolute inset-0 -z-10">
        {background?.type === "video" ? (
          <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
            <source src={background.src} type="video/mp4" />
          </video>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${background?.src || '/images/Machupicchu.jpg'})` }}
          />
        )}
      </div>

      {/* Scrim con dorado suave para contrastar */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,.42), rgba(217,166,74,.18), rgba(0,0,0,.15))",
        }}
      />

      <div className="container mx-auto text-center relative">
        <h2 className="text-4xl md:text-5xl font-russo-one">
          <span className="bg-gradient-to-r from-pm-gold to-amber-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            Conoce el Perú con nosotros
          </span>
        </h2>
        <p className="mt-2 mb-12 opacity-95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
          Destinos disponibles con Perú Mysterious
        </p>

        <Slider {...settings} className="destinos-carousel px-2">
          {destinos.map((d) => (
            <div key={d.name} className="px-4">
              <Link
                to={d.href}
                className="group relative mx-auto block h-64 w-64 overflow-hidden rounded-full
                           ring-2 ring-white/30 hover:ring-pm-gold transition-all duration-300
                           shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_52px_rgba(217,166,74,0.28)]"
              >
                {/* Imagen */}
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />

                {/* Overlay: degradado leve + halo radial para texto */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/45" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
                </div>

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <h3 className="font-russo-one text-3xl drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)]">
                    {d.name}
                  </h3>
                  <span className="mt-2 text-xs tracking-wide
                                   rounded-full bg-white/15 px-3 py-1
                                   ring-1 ring-white/30 backdrop-blur
                                   opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver más
                  </span>
                </div>

                {/* Borde dorado interior sutil */}
                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-pm-gold/25" />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
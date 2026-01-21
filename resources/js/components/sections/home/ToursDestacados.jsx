// src/components/home/ToursDestacados.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoCalendarOutline, IoGlobeOutline, IoArrowForward, IoLocationOutline } from 'react-icons/io5';
import api from '@/lib/api';

/* Chip/Tag dorado claro */
const Tag = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-amber-200/40 bg-[#fff7e0]/70 px-3 py-1 text-xs font-semibold text-pm-black">
    {children}
  </span>
);

/* Tarjeta pequeña de tour (lado derecho) */
const TourCard = ({ tour }) => (
  <article className="flex flex-col overflow-hidden rounded-2xl border border-amber-200/40 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <div className="relative h-40 w-full">
      <img 
        src={tour.featured_image || 'https://via.placeholder.com/400x300?text=Sin+Imagen'} 
        alt={tour.name} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
        }}
      />
      {tour.discount_price && (
        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          Oferta
        </span>
      )}
    </div>

    <div className="flex flex-grow flex-col p-4 font-metropolis text-pm-black">
      <div className="mb-2 flex items-center gap-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <IoCalendarOutline /> 
          <span>{tour.duration_days}D/{tour.duration_nights}N</span>
        </span>
        {tour.destination && (
          <span className="inline-flex items-center gap-1">
            <IoLocationOutline /> 
            <span>{tour.destination.name}</span>
          </span>
        )}
      </div>

      <h4 className="flex-grow font-russo-one text-lg leading-snug text-pm-black line-clamp-2">
        {tour.name}
      </h4>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-600">Desde</span>
          <div className="flex items-center gap-2">
            {tour.discount_price ? (
              <>
                <p className="font-russo-one text-sm text-gray-400 line-through">
                  ${tour.price}
                </p>
                <p className="font-russo-one text-xl text-pm-gold">
                  ${tour.discount_price}
                </p>
              </>
            ) : (
              <p className="font-russo-one text-xl text-pm-black">
                ${tour.price}
              </p>
            )}
          </div>
        </div>

        <Link
          to={`/tours/${tour.slug}`}
          className="inline-flex items-center gap-1 rounded-full border border-pm-gold/40 bg-white px-3 py-1.5 text-sm font-semibold text-pm-black transition hover:bg-pm-gold/10 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
          aria-label={`Ver tour: ${tour.name}`}
        >
          Ver tour <IoArrowForward />
        </Link>
      </div>
    </div>
  </article>
);

export default function ToursDestacados() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedTours();
  }, []);

  const loadFeaturedTours = async () => {
    try {
      const response = await api.get('/tours/featured?limit=5');
      setTours(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar tours destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-white to-[#fff7e0]/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
          </div>
        </div>
      </section>
    );
  }

  if (tours.length === 0) {
    return (
      <section className="bg-gradient-to-b from-white to-[#fff7e0]/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mb-10 text-center">
            <h2 className="font-russo-one text-3xl md:text-4xl text-pm-black">
              Tours Destacados
            </h2>
            <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-pm-gold" />
          </header>
          <div className="text-center py-12">
            <p className="text-gray-600">No hay tours destacados disponibles en este momento</p>
          </div>
        </div>
      </section>
    );
  }

  // El primer tour es el destacado principal (grande)
  const mainTour = tours[0];
  // Los siguientes 4 tours son las tarjetas pequeñas
  const smallTours = tours.slice(1, 5);

  return (
    <section className="bg-gradient-to-b from-white to-[#fff7e0]/40 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-10 text-center">
          <h2 className="font-russo-one text-3xl md:text-4xl text-pm-black">
            Tours Destacados
          </h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-pm-gold" />
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Tarjeta grande (izquierda) - Tour principal destacado */}
          <article className="relative min-h-[500px] overflow-hidden rounded-2xl border border-amber-200/40 bg-white shadow-md">
            <div className="absolute inset-0 -z-10">
              <img
                src={mainTour.featured_image || 'https://via.placeholder.com/800x600?text=Sin+Imagen'}
                alt={mainTour.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Sin+Imagen';
                }}
              />
            </div>
            {/* overlay para legibilidad */}
            <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white md:p-8">
              <div className="space-y-2">
                <Tag>Tour destacado</Tag>
                <h3 className="font-russo-one text-3xl md:text-4xl">
                  {mainTour.name}
                </h3>
              </div>

              {mainTour.short_description && (
                <div className="my-4 max-w-xl text-sm leading-relaxed text-white/95 md:text-base">
                  {mainTour.short_description}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {mainTour.category && <Tag>{mainTour.category.name}</Tag>}
                {mainTour.destination && <Tag>{mainTour.destination.name}</Tag>}
                <Tag>{mainTour.difficulty_level === 'easy' ? 'Fácil' : 
                      mainTour.difficulty_level === 'moderate' ? 'Moderado' : 
                      mainTour.difficulty_level === 'challenging' ? 'Desafiante' : 'Difícil'}</Tag>
                <Tag>{mainTour.duration_days} Días / {mainTour.duration_nights} Noches</Tag>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-sm text-white/80">Desde</span>
                  <div className="flex items-center gap-2">
                    {mainTour.discount_price ? (
                      <>
                        <p className="font-russo-one text-lg text-white/60 line-through">
                          ${mainTour.price}
                        </p>
                        <p className="font-russo-one text-3xl text-pm-gold">
                          ${mainTour.discount_price}
                        </p>
                      </>
                    ) : (
                      <p className="font-russo-one text-3xl text-white">
                        ${mainTour.price}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  to={`/tours/${mainTour.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-pm-gold px-5 py-2.5 font-semibold text-pm-black shadow hover:brightness-110 hover:-translate-y-0.5 transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                >
                  Ver más detalles <IoArrowForward />
                </Link>
              </div>
            </div>
          </article>

          {/* Grid de tarjetas pequeñas (derecha) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {smallTours.length > 0 ? (
              smallTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))
            ) : (
              <div className="col-span-2 flex items-center justify-center text-gray-500 text-sm">
                No hay más tours destacados disponibles
              </div>
            )}
          </div>
        </div>

        {/* Ver todos los tours */}
        <div className="mt-12 text-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 rounded-full border-2 border-pm-gold px-6 py-3 font-semibold text-pm-black transition hover:bg-pm-gold/10 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
          >
            Ver todos los tours <IoArrowForward />
          </Link>
        </div>
      </div>
    </section>
  );
}
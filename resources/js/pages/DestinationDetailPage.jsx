// src/pages/DestinationDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoLocationOutline,
  IoTimeOutline,
  IoCashOutline,
  IoStarOutline,
  IoStar,
} from 'react-icons/io5';

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestination();
  }, [slug]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/destinations/${slug}`);
      setDestination(response.data.data || response.data);
    } catch (error) {
      console.error('Error al cargar destino:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Destino no encontrado
        </h2>
        <Link
          to="/"
          className="px-6 py-3 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={
            destination.featured_image ||
            'https://via.placeholder.com/1920x1080?text=Sin+Imagen'
          }
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/1920x1080?text=Sin+Imagen';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Contenido Hero */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-russo-one text-white mb-4 drop-shadow-lg">
              {destination.name}
            </h1>
            {destination.short_description && (
              <p className="text-lg md:text-xl text-white/90 max-w-3xl drop-shadow-md">
                {destination.short_description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Descripción */}
        {destination.description && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sobre {destination.name}
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {destination.description}
            </p>
          </div>
        )}

        {/* Galería */}
        {destination.gallery && destination.gallery.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destination.gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${destination.name} ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/400x300?text=Error';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tours */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Tours en {destination.name}
          </h2>

          {!destination.tours || destination.tours.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">
                Actualmente no hay tours disponibles para este destino
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.tours.map((tour) => (
                <Link
                  key={tour.id}
                  to={`/tours/${tour.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        tour.featured_image ||
                        'https://via.placeholder.com/400x300?text=Sin+Imagen'
                      }
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />

                    {/* Badge de destacado */}
                    {tour.is_featured && (
                      <span className="absolute top-3 right-3 bg-pm-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                        Destacado
                      </span>
                    )}

                    {/* Badge de descuento */}
                    {tour.discount_price && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Oferta
                      </span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    {/* Categoría */}
                    {tour.category && (
                      <p className="text-xs text-pm-gold font-semibold mb-2 uppercase tracking-wide">
                        {tour.category.name}
                      </p>
                    )}

                    {/* Nombre */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pm-gold transition-colors line-clamp-2">
                      {tour.name}
                    </h3>

                    {/* Descripción corta */}
                    {tour.short_description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {tour.short_description}
                      </p>
                    )}

                    {/* Detalles */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoTimeOutline size={16} className="text-pm-gold" />
                        <span>
                          {tour.duration_days} día
                          {tour.duration_days !== 1 ? 's' : ''} /{' '}
                          {tour.duration_nights} noche
                          {tour.duration_nights !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Rating */}
                      {tour.rating > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) =>
                              i < Math.floor(tour.rating) ? (
                                <IoStar
                                  key={i}
                                  size={16}
                                  className="text-yellow-400"
                                />
                              ) : (
                                <IoStarOutline
                                  key={i}
                                  size={16}
                                  className="text-gray-300"
                                />
                              )
                            )}
                          </div>
                          <span className="text-sm text-gray-600">
                            {tour.rating.toFixed(1)} ({tour.total_reviews}{' '}
                            reseñas)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Precio */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        {tour.discount_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 line-through">
                              ${tour.price}
                            </span>
                            <span className="text-xl font-bold text-pm-gold">
                              ${tour.discount_price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-pm-gold">
                            ${tour.price}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">por persona</p>
                      </div>

                      <span className="text-pm-gold font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Ver tour →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
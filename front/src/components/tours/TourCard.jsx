// ============================================
// src/components/tours/TourCard.jsx
// ============================================

import { Link } from 'react-router-dom';
import { IoCalendarOutline, IoLocationOutline, IoPeopleOutline, IoStar } from 'react-icons/io5';

export default function TourCard({ tour }) {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative h-48">
        <img
          src={tour.featured_image || '/images/placeholder.jpg'}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        {tour.has_discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            ¡Oferta!
          </span>
        )}
        {tour.is_featured && (
          <span className="absolute top-2 left-2 bg-pm-gold text-black px-2 py-1 rounded-md text-sm font-bold">
            Destacado
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        <span className="text-xs text-pm-gold font-semibold uppercase">
          {tour.category?.name}
        </span>

        {/* Título */}
        <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 line-clamp-2">
          {tour.name}
        </h3>

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <IoCalendarOutline />
            {tour.duration_days}D/{tour.duration_nights}N
          </span>
          <span className="flex items-center gap-1">
            <IoLocationOutline />
            {tour.location}
          </span>
        </div>

        {/* Rating */}
        {tour.total_reviews > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-amber-500">
              <IoStar />
              <span className="ml-1 text-sm font-semibold text-gray-800">
                {tour.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({tour.total_reviews} reseñas)
            </span>
          </div>
        )}

        {/* Precio */}
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            {tour.discount_price ? (
              <>
                <span className="text-gray-500 line-through text-sm">
                  ${tour.price}
                </span>
                <p className="text-xl font-bold text-pm-gold">
                  ${tour.discount_price}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-gray-800">
                ${tour.price}
              </p>
            )}
            <span className="text-xs text-gray-500">por persona</span>
          </div>

          <Link
            to={`/tours/${tour.slug}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
}

import React from 'react';

import { Link } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoLocationOutline, 
  IoStar,
  IoHeart,
  IoHeartOutline,
  IoCart
} from 'react-icons/io5';

export default function TourCard({ 
  tour, 
  isFavorite = false, 
  onFavorite, 
  onAddToCart,
  showActions = true 
}) {
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(tour.id, e);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(tour, e);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Imagen */}
      <div className="relative h-48">
        <img
          src={tour.featured_image || '/images/placeholder.jpg'}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges superiores */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {tour.is_featured && (
            <span className="bg-pm-gold text-black px-2 py-1 rounded-md text-xs font-bold shadow-lg">
              ⭐ Destacado
            </span>
          )}
          {tour.discount_price && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
              ¡{Math.round(((tour.price - tour.discount_price) / tour.price) * 100)}% OFF!
            </span>
          )}
        </div>

        {/* Botón de favorito */}
        {showActions && onFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            {isFavorite ? (
              <IoHeart size={20} className="text-red-500" />
            ) : (
              <IoHeartOutline size={20} className="text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        {tour.category?.name && (
          <span className="text-xs text-pm-gold font-semibold uppercase">
            {tour.category.name}
          </span>
        )}

        {/* Título */}
        <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 line-clamp-2 group-hover:text-pm-gold transition-colors">
          {tour.name}
        </h3>

        {/* Descripción corta (opcional) */}
        {tour.short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {tour.short_description}
          </p>
        )}

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
              <IoStar className="fill-current" />
              <span className="ml-1 text-sm font-semibold text-gray-800">
                {tour.rating || 4.5}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({tour.total_reviews} reseñas)
            </span>
          </div>
        )}

        {/* Precio y acciones */}
        <div className="flex items-end justify-between border-t pt-3 gap-3">
          {/* Precio */}
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

          {/* Botones de acción */}
          <div className="flex flex-col gap-2">
            {/* Botón Ver detalles */}
            <Link
              to={`/tours/${tour.slug || tour.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold text-center whitespace-nowrap"
            >
              Ver detalles
            </Link>

            {/* Botón Reservar */}
            {showActions && onAddToCart && (
              <button
                onClick={handleAddToCartClick}
                className="flex items-center justify-center gap-1 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold/90 transition text-sm font-semibold"
              >
                <IoCart size={16} />
                Reservar
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
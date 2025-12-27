// =============================================================
// ARCHIVO: src/components/tours/TourCardWithFavorite.jsx (COMPONENTE REUTILIZABLE)
// =============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHeart, IoHeartOutline, IoCart, IoStar } from 'react-icons/io5';
import useFavoritesStore from '@/store/favoritesStore';
import useAuthStore from '@/store/authStore';

export default function TourCardWithFavorite({ tour }) {
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(tour.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error al actualizar favoritos');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const esFavorito = isFavorite(tour.id);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/tours/${tour.slug || tour.id}`}>
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={tour.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800'}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={handleFavoriteClick}
          disabled={isTogglingFavorite}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isTogglingFavorite ? (
            <div className="animate-spin h-5 w-5 border-2 border-pm-gold border-t-transparent rounded-full"></div>
          ) : esFavorito ? (
            <IoHeart size={20} className="text-red-500" />
          ) : (
            <IoHeartOutline size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {tour.discount_price && (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {Math.round(((tour.price - tour.discount_price) / tour.price) * 100)}% OFF
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <IoStar className="text-yellow-400" />
          <span className="font-semibold">{tour.rating || 0}</span>
          <span>({tour.total_reviews || 0} reseñas)</span>
        </div>

        <Link to={`/tours/${tour.slug || tour.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-pm-gold transition-colors">
            {tour.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {tour.short_description || tour.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            {tour.discount_price ? (
              <>
                <span className="text-2xl font-bold text-pm-gold">
                  ${tour.discount_price}
                </span>
                <span className="text-sm text-gray-400 line-through ml-2">
                  ${tour.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-pm-gold">
                ${tour.price}
              </span>
            )}
            <span className="text-xs text-gray-600 block">/ persona</span>
          </div>

          <Link
            to={`/tours/${tour.slug || tour.id}`}
            className="flex items-center gap-2 bg-pm-gold text-white px-4 py-2 rounded-lg hover:bg-pm-gold/90 transition-colors"
          >
            <IoCart size={20} />
            <span className="font-semibold">Reservar</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

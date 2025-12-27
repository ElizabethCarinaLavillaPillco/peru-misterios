// =============================================================
// ARCHIVO: src/pages/mis-favoritos/page.jsx (NUEVA PÁGINA)
// =============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavoritesStore from '@/store/favoritesStore';
import useAuthStore from '@/store/authStore';
import { IoHeartOutline, IoHeart, IoCart, IoTrash, IoStar } from 'react-icons/io5';

export default function MisFavoritosPage() {
  const { favorites, loadFavorites, removeFavorite, loading } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const [removiendo, setRemoviendo] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const handleRemove = async (tourId) => {
    setRemoviendo(tourId);
    try {
      await removeFavorite(tourId);
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      alert('Error al eliminar de favoritos');
    } finally {
      setRemoviendo(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <IoHeartOutline size={80} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Inicia sesión para ver tus favoritos
          </h2>
          <Link to="/login" className="text-pm-gold hover:underline">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-4">
            <IoHeart size={50} />
            Mis Favoritos
          </h1>
          <p className="text-xl text-white/90">
            {favorites.length} {favorites.length === 1 ? 'tour guardado' : 'tours guardados'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <IoHeartOutline size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Explora nuestros tours y guarda tus favoritos para verlos más tarde
            </p>
            <Link
              to="/tours"
              className="inline-block bg-pm-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-pm-gold/90 transition-colors"
            >
              Explorar tours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((favorite) => (
              <FavoriteCard
                key={favorite.id}
                favorite={favorite}
                onRemove={handleRemove}
                isRemoving={removiendo === favorite.tour_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FavoriteCard({ favorite, onRemove, isRemoving }) {
  const tour = favorite.tour; // El tour viene anidado

  if (!tour) return null;

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={tour.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800'}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        <button
          onClick={() => onRemove(tour.id)}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors disabled:opacity-50"
        >
          {isRemoving ? (
            <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
          ) : (
            <IoHeart size={20} className="text-red-500" />
          )}
        </button>

        {tour.discount_price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {Math.round(((tour.price - tour.discount_price) / tour.price) * 100)}% OFF
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <IoStar className="text-yellow-400" />
          <span className="font-semibold">{tour.rating || 0}</span>
          <span>({tour.total_reviews || 0} reseñas)</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {tour.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.short_description || tour.description}
        </p>

        <div className="flex items-center justify-between mb-4">
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
            <span className="text-sm text-gray-600 block">por persona</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/tours/${tour.slug || tour.id}`}
            className="flex-1 text-center px-4 py-2 border border-pm-gold text-pm-gold rounded-lg hover:bg-pm-gold hover:text-white transition-colors font-semibold"
          >
            Ver detalles
          </Link>
          <Link
            to={`/tours/${tour.slug || tour.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold"
          >
            <IoCart size={20} />
            Reservar
          </Link>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// ARCHIVO: src/pages/destinos/cusco/page.jsx (ACTUALIZADO - CON TOURS REALES)
// =============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCalendarOutline, IoStarOutline, IoPricetagOutline, IoFilterOutline, IoCloseOutline, IoHeartOutline, IoCart } from 'react-icons/io5';
import api from '@/lib/api';
import useFavoritesStore from '@/store/favoritesStore';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';

export default function CuscoPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToCart } = useCartStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: '',
    priceRange: [0, 2000],
    rating: 0,
    duration: '',
    difficulty: '',
  });

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      const response = await api.get('/tours', {
        params: {
          location: 'ICA',
          min_price: filters.priceRange[0],
          max_price: filters.priceRange[1],
          difficulty: filters.difficulty || undefined,
        }
      });
      
      setTours(response.data.data?.data || []);
    } catch (error) {
      console.error('Error cargando tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (tourId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar favoritos');
      navigate('/login');
      return;
    }

    try {
      await toggleFavorite(tourId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToCart = async (tour, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }

    try {
      await addToCart({
        tour_id: tour.id,
        travel_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        number_of_people: 1,
      });
      alert('Tour agregado al carrito');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar al carrito');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600"
          alt="Cusco"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-12">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Tours en Cusco
              </h1>
              <p className="text-xl text-white/90">
                Descubre la capital del Imperio Inca
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar de Filtros - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
                <button 
                  onClick={() => {
                    setFilters({
                      dateRange: '',
                      priceRange: [0, 2000],
                      rating: 0,
                      duration: '',
                      difficulty: '',
                    });
                    loadTours();
                  }}
                  className="text-sm text-pm-gold hover:text-pm-gold/80"
                >
                  Limpiar
                </button>
              </div>

              {/* Precio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <IoPricetagOutline />
                  Precio (USD)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Dificultad */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Dificultad
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => {
                    setFilters({...filters, difficulty: e.target.value});
                    loadTours();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                >
                  <option value="">Todos</option>
                  <option value="easy">Fácil</option>
                  <option value="moderate">Moderado</option>
                  <option value="challenging">Desafiante</option>
                  <option value="difficult">Difícil</option>
                </select>
              </div>

              <button
                onClick={loadTours}
                className="w-full bg-pm-gold text-white py-3 rounded-lg hover:bg-pm-gold/90 font-semibold"
              >
                Aplicar Filtros
              </button>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(true)}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50"
              >
                <IoFilterOutline size={20} />
                <span className="font-semibold">Filtros</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {tours.length} Tours encontrados
                </h2>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Más relevantes</option>
                  <option>Menor precio</option>
                  <option>Mayor precio</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto"></div>
                  <p className="text-gray-600 mt-4">Cargando tours...</p>
                </div>
              ) : tours.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                    <IoFilterOutline size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No hay tours disponibles
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    El administrador aún no ha creado tours para Cusco. ¡Vuelve pronto!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      isFavorite={isFavorite(tour.id)}
                      onFavorite={handleFavorite}
                      onAddToCart={handleAddToCart}
                      onClick={() => navigate(`/tours/${tour.slug || tour.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal filtros móvil */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Filtros</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setFilters({
                    dateRange: '',
                    priceRange: [0, 2000],
                    rating: 0,
                    duration: '',
                    difficulty: '',
                  });
                  setShowFilters(false);
                  loadTours();
                }}
                className="flex-1 px-4 py-3 border rounded-lg font-semibold"
              >
                Limpiar
              </button>
              <button
                onClick={() => {
                  setShowFilters(false);
                  loadTours();
                }}
                className="flex-1 px-4 py-3 bg-pm-gold text-white rounded-lg font-semibold"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TourCard({ tour, isFavorite, onFavorite, onAddToCart, onClick }) {
  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={tour.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800'}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={(e) => onFavorite(tour.id, e)}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          {isFavorite ? (
            <IoHeartOutline size={20} className="text-red-500 fill-red-500" />
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
          <IoStarOutline className="text-yellow-400" />
          <span className="font-semibold">{tour.rating || 0}</span>
          <span>({tour.total_reviews || 0} reseñas)</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {tour.name}
        </h3>

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

          <button
            onClick={(e) => onAddToCart(tour, e)}
            className="flex items-center gap-2 bg-pm-gold text-white px-4 py-2 rounded-lg hover:bg-pm-gold/90 transition-colors"
          >
            <IoCart size={20} />
            <span className="font-semibold">Reservar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
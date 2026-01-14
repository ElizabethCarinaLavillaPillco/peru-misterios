// =============================================================
// ARCHIVO: src/pages/destinos/DestinoToursPage.jsx
// PÁGINA GENÉRICA PARA MOSTRAR TOURS DE CUALQUIER DESTINO
// =============================================================
import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoStarOutline, 
  IoPricetagOutline, 
  IoFilterOutline, 
  IoCloseOutline, 
  IoHeartOutline, 
  IoHeart,
  IoCart,
  IoMapOutline,
  IoLocationOutline
} from 'react-icons/io5';
import api from '@/lib/api';
import useFavoritesStore from '@/store/favoritesStore';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';

// Configuración de destinos
const DESTINOS_CONFIG = {
  cusco: {
    nombre: 'Cusco',
    descripcion: 'Descubre la capital del Imperio Inca',
    imagen: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600',
    location: 'Cusco'
  },
  arequipa: {
    nombre: 'Arequipa',
    descripcion: 'La Ciudad Blanca y el Cañón del Colca',
    imagen: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1600',
    location: 'Arequipa'
  },
  puno: {
    nombre: 'Puno',
    descripcion: 'El Lago Titicaca y las Islas Flotantes',
    imagen: 'https://images.unsplash.com/photo-1604882737751-1e6d75f79d5e?w=1600',
    location: 'Puno'
  },
  ica: {
    nombre: 'Ica',
    descripcion: 'Oasis del desierto y Líneas de Nazca',
    imagen: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1600',
    location: 'Ica'
  },
  huaraz: {
    nombre: 'Huaraz',
    descripcion: 'La Cordillera Blanca y lagunas turquesas',
    imagen: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=1600',
    location: 'Huaraz'
  },
  manu: {
    nombre: 'Manu',
    descripcion: 'Parque Nacional y selva amazónica',
    imagen: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600',
    location: 'Manu'
  }
};

export default function DestinoToursPage() {
  const { destino } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToCart } = useCartStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    difficulty: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const destinoConfig = DESTINOS_CONFIG[destino?.toLowerCase()] || DESTINOS_CONFIG.cusco;

  useEffect(() => {
    loadTours();
  }, [destino]);

  const loadTours = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tours', {
        params: {
          location: destinoConfig.location,
          min_price: filters.priceRange[0],
          max_price: filters.priceRange[1],
          difficulty: filters.difficulty || undefined,
          sort_by: filters.sortBy,
          sort_order: filters.sortOrder,
          per_page: 50
        }
      });
      
      const toursData = response.data.data?.data || response.data.data || [];
      setTours(Array.isArray(toursData) ? toursData : []);
    } catch (error) {
      console.error('Error cargando tours:', error);
      setTours([]);
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
      const travelDate = new Date();
      travelDate.setDate(travelDate.getDate() + 7);
      
      await addToCart({
        tour_id: tour.id,
        travel_date: travelDate.toISOString().split('T')[0],
        number_of_people: 1,
      });
      alert('Tour agregado al carrito');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  const applyFilters = () => {
    loadTours();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 2000],
      difficulty: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    setTimeout(() => loadTours(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={destinoConfig.imagen}
          alt={destinoConfig.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-12">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Tours en {destinoConfig.nombre}
              </h1>
              <p className="text-xl text-white/90">
                {destinoConfig.descripcion}
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
                  onClick={clearFilters}
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
                    className="w-full accent-pm-gold"
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
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                >
                  <option value="">Todos</option>
                  <option value="easy">Fácil</option>
                  <option value="moderate">Moderado</option>
                  <option value="challenging">Desafiante</option>
                  <option value="difficult">Difícil</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Ordenar por
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters({...filters, sortBy, sortOrder});
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                >
                  <option value="created_at-desc">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name-asc">A-Z</option>
                </select>
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-pm-gold text-white py-3 rounded-lg hover:bg-pm-gold/90 font-semibold"
              >
                Aplicar Filtros
              </button>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1">
            {/* Botón de filtros móvil */}
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
                  {tours.length} Tour{tours.length !== 1 ? 's' : ''} encontrado{tours.length !== 1 ? 's' : ''}
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto"></div>
                  <p className="text-gray-600 mt-4">Cargando tours...</p>
                </div>
              ) : tours.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                    <IoMapOutline size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No hay tours disponibles
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    El administrador aún no ha creado tours para {destinoConfig.nombre}. ¡Vuelve pronto!
                  </p>
                  <button
                    onClick={() => navigate('/tours')}
                    className="inline-flex items-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 font-semibold"
                  >
                    Ver todos los tours
                  </button>
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
                      onViewDetails={() => navigate(`/tours/${tour.slug || tour.id}`)}
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

            {/* Precio */}
            <div className="mb-6">
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
                  className="w-full accent-pm-gold"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Dificultad */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Dificultad
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              >
                <option value="">Todos</option>
                <option value="easy">Fácil</option>
                <option value="moderate">Moderado</option>
                <option value="challenging">Desafiante</option>
                <option value="difficult">Difícil</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                className="flex-1 px-4 py-3 border rounded-lg font-semibold"
              >
                Limpiar
              </button>
              <button
                onClick={applyFilters}
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

// ============================================
// COMPONENTE TOURCARD - MEJORADO CON BOTÓN "VER DETALLES"
// ============================================
function TourCard({ tour, isFavorite, onFavorite, onAddToCart, onViewDetails }) {
  return (
    <article className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={tour.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800'}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {tour.is_featured && (
            <span className="bg-pm-gold text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Destacado
            </span>
          )}
          {tour.discount_price && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {Math.round(((tour.price - tour.discount_price) / tour.price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Botón de favorito */}
        <button
          onClick={(e) => onFavorite(tour.id, e)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
        >
          {isFavorite ? (
            <IoHeart size={20} className="text-red-500" />
          ) : (
            <IoHeartOutline size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Categoría */}
        {tour.category?.name && (
          <span className="inline-block text-xs text-pm-gold font-semibold uppercase tracking-wide mb-2">
            {tour.category.name}
          </span>
        )}

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pm-gold transition-colors">
          {tour.name}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {tour.short_description || tour.description}
        </p>

        {/* Info del tour */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1">
            <IoCalendarOutline size={16} />
            {tour.duration_days}D/{tour.duration_nights}N
          </span>
          <span className="flex items-center gap-1">
            <IoLocationOutline size={16} />
            {tour.location}
          </span>
        </div>

        {/* Rating */}
        {tour.total_reviews > 0 ? (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-amber-500">
              <IoStarOutline size={18} className="fill-current" />
              <span className="ml-1 text-sm font-bold text-gray-800">
                {tour.rating || 4.5}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({tour.total_reviews} reseñas)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-gray-400">
              <IoStarOutline size={18} />
              <span className="ml-1 text-sm text-gray-500">Sin reseñas</span>
            </div>
          </div>
        )}

        {/* Precio y acciones */}
        <div className="flex items-end justify-between gap-3">
          {/* Precio */}
          <div>
            {tour.discount_price ? (
              <>
                <span className="text-gray-500 line-through text-sm block">
                  ${tour.price}
                </span>
                <p className="text-2xl font-bold text-pm-gold">
                  ${tour.discount_price}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-800">
                ${tour.price}
              </p>
            )}
            <span className="text-xs text-gray-500">por persona</span>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2">
            {/* Botón Ver Detalles */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold whitespace-nowrap"
            >
              Ver detalles
            </button>

            {/* Botón Reservar */}
            <button
              onClick={(e) => onAddToCart(tour, e)}
              className="flex items-center justify-center gap-2 bg-pm-gold text-white px-4 py-2 rounded-lg hover:bg-pm-gold/90 transition-colors text-sm font-semibold"
            >
              <IoCart size={18} />
              <span>Reservar</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
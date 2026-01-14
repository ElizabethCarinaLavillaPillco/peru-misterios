// src/pages/tours/ToursListPage.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import {
  IoHeartOutline,
  IoHeart,
  IoCalendarOutline,
  IoPeopleOutline,
  IoLocationOutline,
  IoCartOutline,
  IoFilterOutline,
  IoSearchOutline,
  IoClose
} from 'react-icons/io5';

export default function ToursListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') || 'desc',
  });

  useEffect(() => {
    loadTours();
    loadCategories();
    loadFavorites();
  }, [filters]);

  const loadTours = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tours', { params: filters });
      setTours(response.data.data.data || []);
    } catch (error) {
      console.error('Error cargando tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const loadFavorites = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get('/favorites/ids');
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  };

  const toggleFavorite = async (tourId) => {
    if (!isAuthenticated) {
      alert('Por favor inicia sesión para guardar favoritos');
      return;
    }

    try {
      if (favorites.includes(tourId)) {
        // TODO: Eliminar de favoritos
        setFavorites(favorites.filter(id => id !== tourId));
      } else {
        // TODO: Agregar a favoritos
        setFavorites([...favorites, tourId]);
      }
    } catch (error) {
      console.error('Error con favoritos:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Actualizar URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      category: '',
      difficulty: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    };
    setFilters(newFilters);
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explora Nuestros Tours</h1>
          <p className="text-xl text-blue-100">
            Descubre experiencias inolvidables en Perú
          </p>

          {/* Barra de Búsqueda */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Buscar tours por nombre o ubicación..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-pm-gold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              {tours.length} tours encontrados
            </p>
          </div>

          {/* Botón Filtros Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg"
          >
            <IoFilterOutline size={20} />
            Filtros
          </button>

          {/* Ordenar */}
          <select
            value={`${filters.sort_by}-${filters.sort_order}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({ ...filters, sort_by: sortBy, sort_order: sortOrder });
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
          >
            <option value="created_at-desc">Más recientes</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating-desc">Mejor valorados</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Filtros */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block lg:col-span-1`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                {(filters.category || filters.difficulty || filters.search) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Categorías</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', '')}
                      className="w-4 h-4 text-pm-gold"
                    />
                    <span className="ml-2 text-sm text-gray-700">Todas</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.slug}
                        onChange={() => handleFilterChange('category', cat.slug)}
                        className="w-4 h-4 text-pm-gold"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {cat.name} ({cat.tours_count || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dificultad */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Dificultad</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      checked={!filters.difficulty}
                      onChange={() => handleFilterChange('difficulty', '')}
                      className="w-4 h-4 text-pm-gold"
                    />
                    <span className="ml-2 text-sm text-gray-700">Todas</span>
                  </label>
                  {['easy', 'moderate', 'challenging'].map((diff) => (
                    <label key={diff} className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        checked={filters.difficulty === diff}
                        onChange={() => handleFilterChange('difficulty', diff)}
                        className="w-4 h-4 text-pm-gold"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {diff === 'easy' ? 'Fácil' : diff === 'moderate' ? 'Moderado' : 'Desafiante'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Tours */}
          <div className="lg:col-span-3">
            {tours.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No se encontraron tours</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-3 bg-pm-gold text-white rounded-lg hover:bg-pm-gold-dark"
                >
                  Ver todos los tours
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    isFavorite={favorites.includes(tour.id)}
                    onToggleFavorite={() => toggleFavorite(tour.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente TourCard
function TourCard({ tour, isFavorite, onToggleFavorite }) {
  const finalPrice = tour.discount_price || tour.price;
  const hasDiscount = tour.discount_price && tour.discount_price < tour.price;

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <Link to={`/tours/${tour.slug}`}>
          <img
            src={tour.featured_image}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Badge de Descuento */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {Math.round((1 - tour.discount_price / tour.price) * 100)}% OFF
          </div>
        )}

        {/* Botón Favorito */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          {isFavorite ? (
            <IoHeart className="text-red-500" size={20} />
          ) : (
            <IoHeartOutline className="text-gray-600" size={20} />
          )}
        </button>

        {/* Badge de Categoría */}
        <div className="absolute bottom-2 left-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full">
            {tour.category?.name}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <Link to={`/tours/${tour.slug}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-pm-gold transition-colors line-clamp-2">
            {tour.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {tour.short_description}
        </p>

        {/* Detalles */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <IoCalendarOutline size={14} />
            <span>{tour.duration_days}D/{tour.duration_nights}N</span>
          </div>
          <div className="flex items-center gap-1">
            <IoPeopleOutline size={14} />
            <span>Máx. {tour.max_group_size}</span>
          </div>
          <div className="flex items-center gap-1">
            <IoLocationOutline size={14} />
            <span>{tour.location}</span>
          </div>
        </div>

        {/* Precio y CTA */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            {hasDiscount && (
              <p className="text-xs text-gray-500 line-through">
                S/ {tour.price}
              </p>
            )}
            <p className="text-xl font-bold text-gray-900">
              S/ {finalPrice}
            </p>
            <p className="text-xs text-gray-500">por persona</p>
          </div>
          <Link
            to={`/tours/${tour.slug}`}
            className="px-4 py-2 bg-pm-gold hover:bg-pm-gold-dark text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}
// src/pages/ToursList.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoSearchOutline,
  IoFunnelOutline,
  IoCloseOutline,
  IoLocationOutline,
  IoPricetagOutline,
  IoTimeOutline,
  IoStarOutline,
  IoEyeOutline,
  IoHeartOutline,
  IoHeart,
} from 'react-icons/io5';
import useFavoritesStore from '@/store/favoritesStore';
import useAuthStore from '@/store/authStore';

export default function ToursList() {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    min_price: '',
    max_price: '',
    min_rating: '',
    location: '',
    sort_by: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [toursRes, categoriesRes] = await Promise.all([
        api.get('/tours', { params: filters }),
        api.get('/categories'),
      ]);

      const toursData = toursRes.data.data?.data || toursRes.data.data || [];
      setTours(Array.isArray(toursData) ? toursData : []);
      setCategories(categoriesRes.data.data || categoriesRes.data || []);
    } catch (error) {
      console.error('Error al cargar tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      difficulty: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      location: '',
      sort_by: '',
    });
  };

  const handleToggleFavorite = async (tourId) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      if (favorites.includes(tourId)) {
        await removeFavorite(tourId);
      } else {
        await addFavorite(tourId);
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
    }
  };

  const difficultyLabels = {
    easy: 'Fácil',
    moderate: 'Moderado',
    challenging: 'Desafiante',
    difficult: 'Difícil',
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-blue-100 text-blue-800',
    challenging: 'bg-orange-100 text-orange-800',
    difficult: 'bg-red-100 text-red-800',
  };

  // Destinos/Ubicaciones populares en Perú
  const popularLocations = [
    'Cusco',
    'Machu Picchu',
    'Lima',
    'Arequipa',
    'Puno',
    'Iquitos',
    'Paracas',
    'Nazca',
    'Huaraz',
    'Cajamarca',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explora Nuestros Tours
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Descubre experiencias únicas en Perú - Desde Machu Picchu hasta la Amazonía
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <IoFunnelOutline size={20} />
                  Filtros
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Limpiar
                </button>
              </div>

              <div className="space-y-6">
                {/* Búsqueda */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar tours..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Destino/Ubicación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destino
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todos los destinos</option>
                    {popularLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dificultad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dificultad
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="easy">Fácil</option>
                    <option value="moderate">Moderado</option>
                    <option value="challenging">Desafiante</option>
                    <option value="difficult">Difícil</option>
                  </select>
                </div>

                {/* Rango de Precio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Rating Mínimo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating Mínimo
                  </label>
                  <select
                    value={filters.min_rating}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Cualquier rating</option>
                    <option value="4.5">4.5+ estrellas</option>
                    <option value="4.0">4.0+ estrellas</option>
                    <option value="3.5">3.5+ estrellas</option>
                    <option value="3.0">3.0+ estrellas</option>
                  </select>
                </div>

                {/* Ordenar por */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Más recientes</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="popular">Más populares</option>
                    <option value="duration">Duración</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <IoFunnelOutline size={20} />
              Filtros
            </button>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <div
                className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <IoCloseOutline size={24} />
                    </button>
                  </div>

                  {/* Same filters as desktop - Mobile version */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Buscar
                      </label>
                      <input
                        type="text"
                        placeholder="Buscar tours..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Destino
                      </label>
                      <select
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todos los destinos</option>
                        {popularLocations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Categoría
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dificultad
                      </label>
                      <select
                        value={filters.difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todas</option>
                        <option value="easy">Fácil</option>
                        <option value="moderate">Moderado</option>
                        <option value="challenging">Desafiante</option>
                        <option value="difficult">Difícil</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio (USD)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Mín"
                          value={filters.min_price}
                          onChange={(e) => handleFilterChange('min_price', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filters.max_price}
                          onChange={(e) => handleFilterChange('max_price', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rating Mínimo
                      </label>
                      <select
                        value={filters.min_rating}
                        onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Cualquier rating</option>
                        <option value="4.5">4.5+ estrellas</option>
                        <option value="4.0">4.0+ estrellas</option>
                        <option value="3.5">3.5+ estrellas</option>
                        <option value="3.0">3.0+ estrellas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ordenar por
                      </label>
                      <select
                        value={filters.sort_by}
                        onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Más recientes</option>
                        <option value="price_asc">Precio: Menor a Mayor</option>
                        <option value="price_desc">Precio: Mayor a Menor</option>
                        <option value="rating">Mejor valorados</option>
                        <option value="popular">Más populares</option>
                        <option value="duration">Duración</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={clearFilters}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <IoSearchOutline size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No se encontraron tours
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Intenta ajustar tus filtros de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Mostrando <span className="font-semibold text-gray-900">{tours.length}</span> tours
                  </p>
                </div>

                {/* Grid de Tours */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <div key={tour.id} className="group">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Link to={`/tours/${tour.id}`}>
                            <img
                              src={tour.featured_image || 'https://via.placeholder.com/400x300?text=Tour'}
                              alt={tour.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300?text=Tour';
                              }}
                            />
                          </Link>

                          {/* Favorite Button */}
                          <button
                            onClick={() => handleToggleFavorite(tour.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                          >
                            {favorites.includes(tour.id) ? (
                              <IoHeart className="text-red-500" size={20} />
                            ) : (
                              <IoHeartOutline className="text-gray-600" size={20} />
                            )}
                          </button>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {tour.is_featured && (
                              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                                ⭐ Destacado
                              </span>
                            )}
                            {tour.discount_price && (
                              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                                ¡Oferta!
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          {/* Category & Difficulty */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {tour.category && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {tour.category.name}
                              </span>
                            )}
                            {tour.difficulty_level && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[tour.difficulty_level]}`}>
                                {difficultyLabels[tour.difficulty_level]}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <Link to={`/tours/${tour.slug}`}>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {tour.name}
                            </h3>
                          </Link>

                          {/* Short Description */}
                          {tour.short_description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {tour.short_description}
                            </p>
                          )}

                          {/* Meta Info */}
                          <div className="mt-auto space-y-2">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <IoLocationOutline size={16} />
                                {tour.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <IoTimeOutline size={16} />
                                {tour.duration_days}D/{tour.duration_nights}N
                              </span>
                            </div>

                            {/* Rating */}
                            {tour.average_rating > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <IoStarOutline size={16} />
                                  <span className="font-semibold text-gray-900">
                                    {tour.average_rating?.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-gray-500">
                                  ({tour.reviews_count || 0} reseñas)
                                </span>
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div>
                                {tour.discount_price ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-blue-600">
                                      ${tour.discount_price}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ${tour.price}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                                    <IoPricetagOutline size={18} />
                                    ${tour.price}
                                  </div>
                                )}
                              </div>
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <IoEyeOutline size={16} />
                                {tour.views || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

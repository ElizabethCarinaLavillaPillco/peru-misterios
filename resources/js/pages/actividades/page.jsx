// src/pages/actividades/page.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoCompassOutline,
  IoNewspaperOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoFunnelOutline,
  IoLocationOutline,
  IoPricetagOutline,
  IoTimeOutline,
  IoStarOutline,
  IoEyeOutline,
} from 'react-icons/io5';

export default function ActividadesPage() {
  const [activities, setActivities] = useState([]);
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    difficulty_level: '',
    min_price: '',
    max_price: '',
    sort_by: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, toursRes, categoriesRes] = await Promise.all([
        api.get('/activities', { params: filters }),
        api.get('/tours', { params: filters }),
        api.get('/categories'),
      ]);

      const activitiesData = activitiesRes.data.data?.data || activitiesRes.data.data || [];
      const toursData = toursRes.data.data?.data || toursRes.data.data || [];

      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setTours(Array.isArray(toursData) ? toursData : []);
      setCategories(categoriesRes.data.data || categoriesRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setActivities([]);
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
      category_id: '',
      difficulty_level: '',
      min_price: '',
      max_price: '',
      sort_by: '',
    });
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

  // Combinar actividades y tours
  const allItems = [
    ...activities.map(item => ({ ...item, type: 'activity' })),
    ...tours.map(item => ({ ...item, type: 'tour' }))
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Actividades y Experiencias
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Vive aventuras inolvidables en el Perú
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Link al Blog */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <IoNewspaperOutline size={32} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Visita nuestro Blog</h3>
              <p className="text-gray-600">Guías, consejos y experiencias de viaje</p>
            </div>
          </Link>
        </div>

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
                      placeholder="Buscar..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={filters.category_id}
                    onChange={(e) => handleFilterChange('category_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                    value={filters.difficulty_level}
                    onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Ordenar por */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="">Más recientes</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="popular">Más populares</option>
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

                  {/* Same filters as desktop */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Buscar
                      </label>
                      <input
                        type="text"
                        placeholder="Buscar..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Categoría
                      </label>
                      <select
                        value={filters.category_id}
                        onChange={(e) => handleFilterChange('category_id', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                        value={filters.difficulty_level}
                        onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filters.max_price}
                          onChange={(e) => handleFilterChange('max_price', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ordenar por
                      </label>
                      <select
                        value={filters.sort_by}
                        onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Más recientes</option>
                        <option value="price_asc">Precio: Menor a Mayor</option>
                        <option value="price_desc">Precio: Mayor a Menor</option>
                        <option value="rating">Mejor valorados</option>
                        <option value="popular">Más populares</option>
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
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : allItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <IoCompassOutline size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Intenta ajustar tus filtros de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Mostrando <span className="font-semibold text-gray-900">{allItems.length}</span> resultados
                  </p>
                </div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allItems.map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      to={item.type === 'activity' ? `/actividades/${item.slug}` : `/tours/${item.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.featured_image || 'https://via.placeholder.com/400x300?text=Imagen'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Imagen';
                            }}
                          />

                          {/* Badge de tipo */}
                          <div className="absolute top-3 left-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.type === 'activity'
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}>
                              {item.type === 'activity' ? 'Actividad' : 'Tour'}
                            </span>
                          </div>

                          {/* Badges adicionales */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            {item.is_featured && (
                              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                                ⭐ Destacado
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          {/* Category & Difficulty */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {item.category && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                {item.category.name}
                              </span>
                            )}
                            {item.difficulty_level && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[item.difficulty_level]}`}>
                                {difficultyLabels[item.difficulty_level]}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                            {item.title}
                          </h3>

                          {/* Short Description */}
                          {item.short_description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {item.short_description}
                            </p>
                          )}

                          {/* Meta Info */}
                          <div className="mt-auto space-y-2">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <IoLocationOutline size={16} />
                                {item.location}
                              </span>
                              {item.duration_text && (
                                <span className="flex items-center gap-1">
                                  <IoTimeOutline size={16} />
                                  {item.duration_text}
                                </span>
                              )}
                            </div>

                            {/* Price & Views */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                                <IoPricetagOutline size={18} />
                                ${item.price}
                              </div>
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <IoEyeOutline size={16} />
                                {item.views || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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

// ============================================
// src/pages/ToursList.jsx
// ============================================

import { useState, useEffect } from 'react';
import { tourAPI, categoryAPI } from '@/lib/api';
import TourCard from '@/components/tours/TourCard';
import { IoSearchOutline, IoFunnelOutline } from 'react-icons/io5';

export default function ToursList() {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    sort_by: 'created_at',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [toursData, categoriesData] = await Promise.all([
        tourAPI.getAll(filters),
        categoryAPI.getAll(),
      ]);
      setTours(toursData.data);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error al cargar tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Explora Nuestros Tours
          </h1>
          <p className="text-gray-600">
            Descubre experiencias únicas en Perú
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar tours..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categoría */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Dificultad */}
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Cualquier dificultad</option>
              <option value="easy">Fácil</option>
              <option value="moderate">Moderado</option>
              <option value="challenging">Desafiante</option>
            </select>

            {/* Ordenar */}
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters({...filters, sort_by: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Más recientes</option>
              <option value="price">Precio: Menor a Mayor</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </form>
        </div>

        {/* Lista de tours */}
        {tours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No se encontraron tours</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
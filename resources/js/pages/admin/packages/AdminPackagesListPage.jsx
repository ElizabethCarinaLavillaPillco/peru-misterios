// src/pages/admin/packages/AdminPackagesListPage.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import {
  IoAdd,
  IoSearch,
  IoEye,
  IoPencil,
  IoTrash,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCubeOutline
} from 'react-icons/io5';

export default function AdminPackagesListPage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await api.get('/packages');
      const packagesData = response.data?.data?.data || response.data?.data || [];
      setPackages(Array.isArray(packagesData) ? packagesData : []);
    } catch (error) {
      console.error('Error cargando paquetes:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm('¿Estás seguro de eliminar este paquete?')) return;

    try {
      await api.delete(`/admin/packages/${packageId}`);
      setPackages(packages.filter(p => p.id !== packageId));
      alert('Paquete eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando paquete:', error);
      alert('Error al eliminar el paquete');
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && pkg.is_active) ||
      (filterStatus === 'inactive' && !pkg.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Paquetes</h1>
            <p className="text-gray-600 mt-1">
              {filteredPackages.length} paquete{filteredPackages.length !== 1 ? 's' : ''} encontrado{filteredPackages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/admin/packages/create"
            className="flex items-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold shadow-md"
          >
            <IoAdd size={20} />
            Crear Nuevo Paquete
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar paquetes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Packages List */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <IoCubeOutline size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron paquetes' : 'No hay paquetes creados'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer paquete turístico'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/admin/packages/create"
                className="inline-flex items-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold"
              >
                <IoAdd size={20} />
                Crear Primer Paquete
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPackages.map((pkg) => {
              const finalPrice = pkg.discount_price || pkg.price;
              const hasDiscount = pkg.discount_price && pkg.discount_price < pkg.price;

              return (
                <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    {/* Imagen */}
                    <div className="flex-shrink-0">
                      <img
                        src={pkg.featured_image || 'https://via.placeholder.com/200'}
                        alt={pkg.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Información */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{pkg.short_description}</p>
                        </div>
                        {pkg.is_active ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <IoCheckmarkCircle size={14} />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            <IoCloseCircle size={14} />
                            Inactivo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <span>📅 {pkg.total_days}D/{pkg.total_nights}N</span>
                        <span>👥 Max {pkg.max_group_size}</span>
                        <span>🎯 {pkg.tours?.length || 0} tours</span>
                        {pkg.category?.name && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                            {pkg.category.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          {hasDiscount ? (
                            <>
                              <span className="text-2xl font-bold text-green-600">${finalPrice}</span>
                              <span className="text-sm text-gray-400 line-through">${pkg.price}</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-gray-900">${pkg.price}</span>
                          )}
                          <span className="text-sm text-gray-500">por persona</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/packages/${pkg.slug || pkg.id}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver paquete"
                          >
                            <IoEye size={20} />
                          </Link>
                          <Link
                            to={`/admin/packages/${pkg.id}/edit`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <IoPencil size={20} />
                          </Link>
                          <button
                            onClick={() => handleDelete(pkg.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <IoTrash size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

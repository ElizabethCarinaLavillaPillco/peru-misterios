// src/pages/admin/destinations/DestinationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoAddCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoSearchOutline,
} from 'react-icons/io5';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/destinations');
      setDestinations(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar destinos:', error);
      alert('Error al cargar destinos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este destino?')) return;

    try {
      await api.delete(`/admin/destinations/${id}`);
      alert('Destino eliminado exitosamente');
      loadDestinations();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(error.response?.data?.message || 'Error al eliminar el destino');
    }
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Destinos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los destinos turísticos disponibles
            </p>
          </div>
          <Link
            to="/admin/destinations/create"
            className="flex items-center gap-2 px-6 py-3 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors font-semibold"
          >
            <IoAddCircleOutline size={20} />
            Nuevo Destino
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearchOutline
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar destinos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">Total Destinos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {destinations.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">Destinos Activos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {destinations.filter((d) => d.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">Con Tours</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {destinations.filter((d) => d.tours_count > 0).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tours
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No se encontraron destinos
                  </td>
                </tr>
              ) : (
                filteredDestinations.map((destination) => (
                  <tr key={destination.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {destination.featured_image ? (
                          <img
                            src={destination.featured_image}
                            alt={destination.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/100x100?text=Sin+Imagen';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sin imagen</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {destination.name}
                          </p>
                          <p className="text-sm text-gray-500">{destination.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {destination.tours_count || 0} tours
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {destination.is_active ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <IoCheckmarkCircle size={16} />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          <IoCloseCircle size={16} />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{destination.order || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/destinations/${destination.slug}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver"
                        >
                          <IoEyeOutline size={20} />
                        </Link>
                        <Link
                          to={`/admin/destinations/edit/${destination.id}`}
                          className="p-2 text-gray-600 hover:text-pm-gold hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <IoCreateOutline size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(destination.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <IoTrashOutline size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
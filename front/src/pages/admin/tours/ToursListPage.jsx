// =============================================================
// ARCHIVO: src/pages/admin/tours/ToursListPage.jsx
// =============================================================

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
  IoMapOutline
} from 'react-icons/io5';

export default function ToursListPage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      const response = await api.get('/tours');
      // Si la respuesta está paginada, los datos estarán en response.data.data.data
      // Si no está paginada, estarán en response.data.data
      const toursData = response.data.data.data || response.data.data || [];
      setTours(Array.isArray(toursData) ? toursData : []);
    } catch (error) {
      console.error('Error cargando tours:', error);
      setTours([]); // Asegurarse de que tours sea siempre un array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId) => {
    if (!confirm('¿Estás seguro de eliminar este tour?')) return;

    try {
      await api.delete(`/admin/tours/${tourId}`);
      setTours(tours.filter(t => t.id !== tourId));
      alert('Tour eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando tour:', error);
      alert('Error al eliminar el tour');
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && tour.is_active) ||
      (filterStatus === 'inactive' && !tour.is_active);
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Tours</h1>
            <p className="text-gray-600 mt-1">
              {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} encontrado{filteredTours.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/admin/tours/create"
            className="flex items-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold shadow-md"
          >
            <IoAdd size={20} />
            Crear Nuevo Tour
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar tours..."
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

        {/* Tours List */}
        {filteredTours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <IoMapOutline size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron tours' : 'No hay tours creados'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer tour'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/admin/tours/create"
                className="inline-flex items-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold"
              >
                <IoAdd size={20} />
                Crear Primer Tour
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.featured_image || 'https://via.placeholder.com/100'}
                            alt={tour.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{tour.name}</div>
                            <div className="text-sm text-gray-500">{tour.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {tour.category?.name || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            ${tour.discount_price || tour.price}
                          </div>
                          {tour.discount_price && (
                            <div className="text-gray-400 line-through text-xs">
                              ${tour.price}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {tour.duration_days}D / {tour.duration_nights}N
                      </td>
                      <td className="px-6 py-4">
                        {tour.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <IoCheckmarkCircle size={14} />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            <IoCloseCircle size={14} />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/tours/${tour.slug || tour.id}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver tour"
                          >
                            <IoEye size={18} />
                          </Link>
                          <Link
                            to={`/admin/tours/${tour.id}/edit`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <IoPencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(tour.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <IoTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

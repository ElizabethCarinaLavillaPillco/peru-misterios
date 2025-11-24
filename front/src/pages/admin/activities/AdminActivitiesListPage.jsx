// src/pages/admin/activities/AdminActivitiesListPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoAddCircleOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoPricetagOutline,
} from 'react-icons/io5';

export default function AdminActivitiesListPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadActivities();
    loadStats();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/activities');
      setActivities(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      alert('Error al cargar las actividades');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/activities/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;

    try {
      await api.delete(`/admin/activities/${id}`);
      alert('Actividad eliminada exitosamente');
      loadActivities();
      loadStats();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      alert('Error al eliminar la actividad');
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && activity.is_active) ||
      (filterStatus === 'inactive' && !activity.is_active);

    return matchesSearch && matchesStatus;
  });

  const difficultyLabels = {
    easy: 'Fácil',
    moderate: 'Moderado',
    challenging: 'Desafiante',
    difficult: 'Difícil',
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    moderate: 'bg-blue-100 text-blue-800 border-blue-300',
    challenging: 'bg-orange-100 text-orange-800 border-orange-300',
    difficult: 'bg-red-100 text-red-800 border-red-300',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Actividades</h1>
            <p className="text-gray-600 mt-1">Administra todas las actividades y experiencias</p>
          </div>
          <Link
            to="/admin/activities/create"
            className="flex items-center gap-2 px-6 py-3 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors font-semibold"
          >
            <IoAddCircleOutline size={20} />
            Crear Nueva Actividad
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Actividades</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_activities}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <IoLocationOutline className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <IoCheckmarkCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Destacadas</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <IoPricetagOutline className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Vistas</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.total_views}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <IoEyeOutline className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por título o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No se encontraron actividades</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={activity.featured_image || 'https://via.placeholder.com/200x150?text=Actividad'}
                      alt={activity.title}
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {activity.title}
                        </h3>
                        {activity.short_description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {activity.short_description}
                          </p>
                        )}
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col gap-2">
                        {activity.is_active ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-300">
                            <IoCheckmarkCircle size={16} />
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-300">
                            <IoCloseCircle size={16} />
                            Inactiva
                          </span>
                        )}
                        {activity.is_featured && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-300">
                            ⭐ Destacada
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <IoLocationOutline size={16} />
                        {activity.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <IoPricetagOutline size={16} />
                        ${activity.price}
                      </span>
                      {activity.duration_text && (
                        <span className="flex items-center gap-1">
                          <IoTimeOutline size={16} />
                          {activity.duration_text}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${difficultyColors[activity.difficulty_level]}`}>
                        {difficultyLabels[activity.difficulty_level]}
                      </span>
                      {activity.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {activity.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <IoEyeOutline size={16} />
                        {activity.views} vistas
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <a
                        href={`/actividades/${activity.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors backup text-sm font-medium"
                      >
                        <IoEyeOutline size={16} />
                        Ver
                      </a>
                      <Link
                        to={`/admin/activities/${activity.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <IoCreateOutline size={16} />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <IoTrashOutline size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

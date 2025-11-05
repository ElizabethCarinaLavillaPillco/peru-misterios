
// ============================================
// src/pages/admin/AdminDashboard.jsx
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { userAPI } from '@/lib/api';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadStats();
  }, [isAuthenticated, user, navigate]);

  const loadStats = async () => {
    try {
      const data = await userAPI.stats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Usuarios</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.total_users || 0}</p>
          </div>

          <div className="card">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Clientes</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.total_clients || 0}</p>
          </div>

          <div className="card">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Administradores</h3>
            <p className="text-3xl font-bold text-purple-600">{stats?.total_admins || 0}</p>
          </div>

          <div className="card">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Usuarios Activos</h3>
            <p className="text-3xl font-bold text-pm-gold">{stats?.active_users || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-primary">
              Crear Nuevo Tour
            </button>
            <button className="btn-primary">
              Gestionar Usuarios
            </button>
            <button className="btn-primary">
              Ver Reservas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
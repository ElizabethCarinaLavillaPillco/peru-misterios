// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { userAPI } from '@/lib/api';
import { 
  IoPersonOutline, 
  IoBusinessOutline, 
  IoStatsChartOutline,
  IoLogOutOutline,
  IoMapOutline,
  IoCalendarOutline,
  IoSettingsOutline
} from 'react-icons/io5';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuthStore();
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

  const handleLogout = () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Admin */}
      <nav className="bg-pm-black border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/logo-peru-mysterious-blanco.png"
                  alt="Perú Mysterious"
                  className="h-8 w-auto"
                />
              </Link>
              <span className="text-white/60 text-sm">Panel de Administración</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/admin" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/tours" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Tours
              </Link>
              <Link 
                to="/admin/bookings" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Reservas
              </Link>
              <Link 
                to="/admin/users" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Usuarios
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-white/70 hover:text-white text-sm"
              >
                Ver Sitio
              </Link>
              <div className="flex items-center gap-2 text-white/90">
                <IoPersonOutline size={20} />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <IoLogOutOutline size={18} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu plataforma de turismo desde aquí
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoPersonOutline className="text-blue-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">USUARIOS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.total_users || 0}
            </h3>
            <p className="text-sm text-gray-600">Total de usuarios</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoBusinessOutline className="text-green-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">CLIENTES</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.total_clients || 0}
            </h3>
            <p className="text-sm text-gray-600">Usuarios registrados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoSettingsOutline className="text-purple-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">ADMINS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.total_admins || 0}
            </h3>
            <p className="text-sm text-gray-600">Administradores</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <IoStatsChartOutline className="text-yellow-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">ACTIVOS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.active_users || 0}
            </h3>
            <p className="text-sm text-gray-600">Usuarios activos</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/tours/create"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <IoMapOutline size={24} />
              <div>
                <h3 className="font-semibold">Crear Nuevo Tour</h3>
                <p className="text-sm text-white/80">Agrega tours al catálogo</p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            >
              <IoPersonOutline size={24} />
              <div>
                <h3 className="font-semibold">Gestionar Usuarios</h3>
                <p className="text-sm text-white/80">Administra usuarios del sistema</p>
              </div>
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <IoCalendarOutline size={24} />
              <div>
                <h3 className="font-semibold">Ver Reservas</h3>
                <p className="text-sm text-white/80">Gestiona las reservas</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="text-center py-8 text-gray-500">
            <IoStatsChartOutline size={48} className="mx-auto mb-2 text-gray-400" />
            <p>No hay actividad reciente para mostrar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
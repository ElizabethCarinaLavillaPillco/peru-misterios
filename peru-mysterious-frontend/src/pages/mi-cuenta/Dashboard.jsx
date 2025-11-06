// src/pages/mi-cuenta/Dashboard.jsx

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { 
  IoPersonOutline, 
  IoCalendarOutline, 
  IoHeartOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoMapOutline,
  IoStarOutline
} from 'react-icons/io5';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Cliente */}
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
              <span className="text-white/60 text-sm hidden md:block">Mi Cuenta</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/mi-cuenta" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/mis-reservas" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Mis Reservas
              </Link>
              <Link 
                to="/favoritos" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Favoritos
              </Link>
              <Link 
                to="/mi-cuenta/perfil" 
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Mi Perfil
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-white/70 hover:text-white text-sm flex items-center gap-1"
              >
                <IoHomeOutline size={18} />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <div className="flex items-center gap-2 text-white/90">
                <IoPersonOutline size={20} />
                <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <IoLogOutOutline size={18} />
                <span className="hidden sm:inline">Salir</span>
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
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido a tu panel de control
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoCalendarOutline className="text-blue-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">RESERVAS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-sm text-gray-600">Reservas activas</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoMapOutline className="text-green-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">TOURS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-sm text-gray-600">Tours completados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <IoHeartOutline className="text-pink-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">FAVORITOS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-sm text-gray-600">Tours guardados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <IoStarOutline className="text-yellow-600" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">PUNTOS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-sm text-gray-600">Puntos de recompensa</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/tours"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-pm-gold to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <IoMapOutline size={24} />
              <div>
                <h3 className="font-semibold">Explorar Tours</h3>
                <p className="text-sm text-white/80">Descubre nuevos destinos</p>
              </div>
            </Link>

            <Link
              to="/mis-reservas"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <IoCalendarOutline size={24} />
              <div>
                <h3 className="font-semibold">Mis Reservas</h3>
                <p className="text-sm text-white/80">Ver mis viajes</p>
              </div>
            </Link>

            <Link
              to="/favoritos"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <IoHeartOutline size={24} />
              <div>
                <h3 className="font-semibold">Favoritos</h3>
                <p className="text-sm text-white/80">Tours guardados</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Reservas Vacías */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <IoCalendarOutline size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aún no tienes reservas
          </h3>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestros tours y comienza tu aventura por Perú!
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold hover:bg-pm-gold-dark text-white font-semibold rounded-lg transition-colors"
          >
            <IoMapOutline size={20} />
            Ver Tours Disponibles
          </Link>
        </div>
      </div>
    </div>
  );
}
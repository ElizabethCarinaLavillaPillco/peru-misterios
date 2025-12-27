// src/pages/mi-cuenta/Dashboard.jsx

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useFavoritesStore from '@/store/favoritesStore';
import useCartStore from '@/store/cartStore';
import api from '@/lib/api';
import {
  IoPersonOutline,
  IoCalendarOutline,
  IoHeartOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoMapOutline,
  IoCart,
  IoArrowForward
} from 'react-icons/io5';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favorites, loadFavorites } = useFavoritesStore();
  const { items, loadCart } = useCartStore();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setError(null);

      const results = await Promise.allSettled([
        loadFavorites(),
        loadCart(),
        loadBookings()
      ]);

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Error en carga ${index}:`, result.reason);
        }
      });

    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar algunos datos');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await api.get('/my-bookings');
      const bookingsData = response.data?.data || response.data || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setBookings([]);
      throw error;
    }
  };

  const handleDownloadReceipt = async (bookingId, bookingCode) => {
	try {
	  const response = await api.get(`/bookings/${bookingId}/receipt`, {
		responseType: 'blob'
	  });

	  const url = window.URL.createObjectURL(new Blob([response.data]));
	  const link = document.createElement('a');
	  link.href = url;
	  link.setAttribute('download', `comprobante-${bookingCode}.pdf`);
	  document.body.appendChild(link);
	  link.click();
	  link.remove();
	  window.URL.revokeObjectURL(url);
	} catch (error) {
	  console.error('Error descargando comprobante:', error);
	  alert('Error al descargar el comprobante. Intenta nuevamente.');
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const safeItems = Array.isArray(items) ? items : [];

  const activeBookings = safeBookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed');
  const completedTours = safeBookings.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Cliente */}
      <nav className="bg-pm-black border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
                to="/mis-favoritos"
                className="text-white/90 hover:text-pm-gold transition-colors text-sm font-medium"
              >
                Favoritos
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm flex items-center gap-1"
              >
                <IoHomeOutline size={18} />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 bg-pm-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
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
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              {error}
            </div>
          )}
        </div>

        {/* Stats Cards - CLICKEABLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Reservas */}
          <Link
            to="/mis-reservas"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <IoCalendarOutline className="text-blue-600" size={24} />
              </div>
              <IoArrowForward className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeBookings.length}</h3>
            <p className="text-sm text-gray-600">Reservas activas</p>
          </Link>

          {/* Card Tours Completados */}
          <Link
            to="/mis-reservas"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <IoMapOutline className="text-green-600" size={24} />
              </div>
              <IoArrowForward className="text-gray-400 group-hover:text-green-600 transition-colors" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{completedTours}</h3>
            <p className="text-sm text-gray-600">Tours completados</p>
          </Link>

          {/* Card Favoritos */}
          <Link
            to="/mis-favoritos"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-pink-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                <IoHeartOutline className="text-pink-600" size={24} />
              </div>
              <IoArrowForward className="text-gray-400 group-hover:text-pink-600 transition-colors" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{safeFavorites.length}</h3>
            <p className="text-sm text-gray-600">Tours guardados</p>
          </Link>

          {/* Card Carrito */}
          <Link
            to="/cart"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-yellow-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <IoCart className="text-yellow-600" size={24} />
              </div>
              <IoArrowForward className="text-gray-400 group-hover:text-yellow-600 transition-colors" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{safeItems.length}</h3>
            <p className="text-sm text-gray-600">Items en carrito</p>
          </Link>
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
              to="/mis-favoritos"
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

        {/* Reservas Activas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Próximos Viajes</h2>
            {activeBookings.length > 0 && (
              <Link
                to="/mis-reservas"
                className="text-pm-gold hover:text-pm-gold/80 font-semibold text-sm flex items-center gap-1"
              >
                Ver todas
                <IoArrowForward size={16} />
              </Link>
            )}
          </div>

          {activeBookings.length === 0 ? (
            <div className="text-center py-12">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold hover:bg-pm-gold/90 text-white font-semibold rounded-lg transition-colors"
              >
                <IoMapOutline size={20} />
                Ver Tours Disponibles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{booking.tour?.name || 'Tour'}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.travel_date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.number_of_people} persona(s) · {booking.booking_code}
                      </p>
                    </div>
                    <Link
                      to="/mis-reservas"
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
                    >
                      Ver Detalles
                    </Link>
					{booking.payment_status === 'paid' && (
					<button
						onClick={() => handleDownloadReceipt(booking.id, booking.booking_code)}
						className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-sm flex items-center justify-center gap-1"
					>
						<IoDownloadOutline size={16} />
						Comprobante
					</button>
					)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

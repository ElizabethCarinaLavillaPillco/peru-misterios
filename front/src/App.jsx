// =============================================================
// ARCHIVO: src/App.jsx (CORREGIDO)
// =============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import useFavoritesStore from './store/favoritesStore';

// Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Pages - Public
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - Destinos
import DestinosPage from './pages/destinos/page';
import DestinoToursPage from './pages/destinos/DestinoToursPage';

// Pages - Tours
import ToursList from './pages/ToursList';
import TourDetail from './pages/TourDetail';
import PaquetesPage from './pages/paquetes/page';
import PaqueteDetallePage from './pages/paquetes/[slug]/page';

// Pages - Hoteles
import HotelesPage from './pages/hoteles/page';
import HotelesCuscoPage from './pages/hoteles/cusco/page';
import HotelesLimaPage from './pages/hoteles/lima/page';

// Pages - Actividades
import ActividadesPage from './pages/actividades/page';
import BlogPage from './pages/actividades/blog/page';

// Pages - Institucionales
import NosotrosPage from './pages/nosotros/page';
import ContactoPage from './pages/contacto/page';
import AyudaPage from './pages/ayuda/page';

// Pages - User
import Cart from './pages/Cart';
import PagoPage from './pages/pagos/page';
import MyBookings from './pages/MyBookings';
import MisFavoritosPage from './pages/mis-favoritos/page';
import ResumenReservaPage from './pages/resumen-reserva/page';
import Dashboard from './pages/mi-cuenta/Dashboard';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ToursListPage from './pages/admin/tours/ToursListPage';
import CreateTourPage from './pages/admin/tours/CreateTourPage';
import UsersListPage from './pages/admin/users/UsersListPage';
import BookingsListPage from './pages/admin/bookings/BookingsListPage';
import BookingsStatsPage from './pages/admin/stats/BookingsStatsPage';

// Pages - Admin - Packages
import PackagesListPage from './pages/admin/packages/PackagesListPage';
import CreatePackagePage from './pages/admin/packages/CreatePackagePage';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/mi-cuenta" replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/mi-cuenta'} replace />;
  }

  return children;
};

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { loadFavorites } = useFavoritesStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated, loadFavorites]);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas con Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Destinos */}
          <Route path="/destinos" element={<DestinosPage />} />
          <Route path="/destinos/:destino" element={<DestinoToursPage />} />

          {/* Tours/Paquetes */}
          <Route path="/tours" element={<ToursList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/paquetes" element={<PaquetesPage />} />
          <Route path="/paquetes/:slug" element={<PaqueteDetallePage />} />

          {/* Hoteles */}
          <Route path="/hoteles" element={<HotelesPage />} />
          <Route path="/hoteles/cusco" element={<HotelesCuscoPage />} />
          <Route path="/hoteles/lima" element={<HotelesLimaPage />} />

          {/* Actividades y Blog */}
          <Route path="/actividades" element={<ActividadesPage />} />
          <Route path="/blog" element={<BlogPage />} />

          {/* Institucionales */}
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/ayuda" element={<AyudaPage />} />

          {/* Carrito y Pagos */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/pagos" element={<PagoPage />} />

          {/* Favoritos (protegida) */}
          <Route 
            path="/mis-favoritos" 
            element={
              <ProtectedRoute>
                <MisFavoritosPage />
              </ProtectedRoute>
            } 
          />

          {/* Mis Reservas (protegida) */}
          <Route 
            path="/mis-reservas" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />

          {/* Resumen de reserva después del pago */}
          <Route 
            path="/resumen-reserva" 
            element={
              <ProtectedRoute>
                <ResumenReservaPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Dashboard de cliente (sin Layout) */}
        <Route 
          path="/mi-cuenta" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Dashboard de admin con AdminLayout */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          
          {/* Tours */}
          <Route path="tours" element={<ToursListPage />} />
          <Route path="tours/create" element={<CreateTourPage />} />
          <Route path="tours/:id/edit" element={<CreateTourPage />} />
          
          {/* PAQUETES - RUTAS CORRECTAS (DENTRO DE /admin) */}
          <Route path="packages" element={<PackagesListPage />} />
          <Route path="packages/create" element={<CreatePackagePage />} />
          <Route path="packages/:id/edit" element={<CreatePackagePage />} />
          
          {/* Users, Bookings, Stats */}
          <Route path="users" element={<UsersListPage />} />
          <Route path="bookings" element={<BookingsListPage />} />
          <Route path="stats" element={<BookingsStatsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
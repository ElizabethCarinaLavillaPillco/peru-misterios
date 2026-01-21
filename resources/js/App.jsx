import React from 'react';
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

// Pages - Paquetes (PÚBLICO)
import PackagesListPage from './pages/packages/PackagesListPage';
import PackageDetail from './pages/packages/PackageDetail';

// Pages - Hoteles
import HotelesPage from './pages/hoteles/page';
import HotelesCuscoPage from './pages/hoteles/cusco/page';
import HotelesLimaPage from './pages/hoteles/lima/page';

// Pages - Actividades
import ActividadesPage from './pages/actividades/page';
import ActivityDetailPage from './pages/actividades/ActivityDetailPage';

import BlogPage from './pages/actividades/blog/page';
import BlogDetailPage from './pages/actividades/blog/BlogDetailPage';

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
import AdminToursListPage from './pages/admin/tours/ToursListPage';
import CreateTourPage from './pages/admin/tours/CreateTourPage';
import UsersListPage from './pages/admin/users/UsersListPage';
import BookingsListPage from './pages/admin/bookings/BookingsListPage';
import BookingsStatsPage from './pages/admin/stats/BookingsStatsPage';
import AdminPackagesListPage from './pages/admin/packages/AdminPackagesListPage';
import CreatePackagePage from './pages/admin/packages/CreatePackagePage';
import AdminBlogsListPage from './pages/admin/blogs/AdminBlogsListPage';
import CreateBlogPage from './pages/admin/blogs/CreateBlogPage';
import AdminActivitiesListPage from './pages/admin/activities/AdminActivitiesListPage';
import CreateActivityPage from './pages/admin/activities/CreateActivityPage';

import ScrollToTop from '@/components/ScrollToTop';


//destinos
import DestinationsPage from '@/pages/admin/destinations/DestinationsPage';
import CreateDestinationPage from '@/pages/admin/destinations/CreateDestinationPage';
import DestinationDetailPage from '@/pages/DestinationDetailPage';


// Protected Route
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
    <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/destinos" element={<DestinosPage />} />
          <Route path="/destinos/:destino" element={<DestinoToursPage />} />

          <Route path="/tours" element={<ToursList />} />
          <Route path="/tours/:id" element={<TourDetail />} />

          <Route path="/packages" element={<PackagesListPage />} />
          <Route path="/packages/:id" element={<PackageDetail />} />

          <Route path="/hoteles" element={<HotelesPage />} />
          <Route path="/hoteles/cusco" element={<HotelesCuscoPage />} />
          <Route path="/hoteles/lima" element={<HotelesLimaPage />} />

          <Route path="/actividades" element={<ActividadesPage />} />
          <Route path="/actividades/:slug" element={<ActivityDetailPage />} />

          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/ayuda" element={<AyudaPage />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/pagos" element={<ProtectedRoute><PagoPage /></ProtectedRoute>} />

          <Route path="/mis-favoritos" element={<ProtectedRoute><MisFavoritosPage /></ProtectedRoute>} />
          <Route path="/mis-reservas" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/resumen-reserva" element={<ProtectedRoute><ResumenReservaPage /></ProtectedRoute>} />
        </Route>

        <Route path="/mi-cuenta" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />

          {/* Destinos - NUEVO */}
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="destinations/create" element={<CreateDestinationPage />} />
          <Route path="destinations/edit/:id" element={<CreateDestinationPage />} />
          
          <Route path="tours" element={<AdminToursListPage />} />
          <Route path="tours/create" element={<CreateTourPage />} />
          <Route path="tours/:id/edit" element={<CreateTourPage />} />

          <Route path="packages" element={<AdminPackagesListPage />} />
          <Route path="packages/create" element={<CreatePackagePage />} />
          <Route path="packages/:id/edit" element={<CreatePackagePage />} />

          <Route path="blogs" element={<AdminBlogsListPage />} />
          <Route path="blogs/create" element={<CreateBlogPage />} />
          <Route path="blogs/:id/edit" element={<CreateBlogPage />} />

          <Route path="activities" element={<AdminActivitiesListPage />} />
          <Route path="activities/create" element={<CreateActivityPage />} />
          <Route path="activities/:id/edit" element={<CreateActivityPage />} />

          <Route path="users" element={<UsersListPage />} />
          <Route path="bookings" element={<BookingsListPage />} />
          <Route path="stats" element={<BookingsStatsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
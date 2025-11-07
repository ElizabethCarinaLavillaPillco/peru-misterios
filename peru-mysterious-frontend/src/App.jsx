// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// Importar estilos de slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/mi-cuenta/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ToursList from './pages/ToursList';
import TourDetail from './pages/TourDetail';
import Cart from './pages/Cart';
import MyBookings from './pages/MyBookings';

// Páginas adicionales (necesitas crearlas o importarlas)
import DestinosPage from './pages/destinos/page';
import DestinoDetalle1 from './pages/destinos/1/page';
import DestinoDetalle2 from './pages/destinos/2/page';
import DestinoDetalle3 from './pages/destinos/3/page';
import HotelesPage from './pages/hoteles/page';
import HotelesCuscoPage from './pages/hoteles/cusco/page';
import HotelesLimaPage from './pages/hoteles/lima/page';
import ActividadesPage from './pages/actividades/page';
import BlogPage from './pages/actividades/blog/page';
import NosotrosPage from './pages/nosotros/page';
import PaquetesPage from './pages/paquetes/page';
import PaqueteDetallePage from './pages/paquetes/[slug]/page';
import PagoPage from './pages/pagos/page';

// Páginas temporales (crear después)
import ContactoPage from './pages/contacto/page';
import AyudaPage from './pages/ayuda/page';

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
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
          <Route path="/destinos/cusco" element={<DestinoDetalle1 />} />
          <Route path="/destinos/arequipa" element={<DestinoDetalle2 />} />
          <Route path="/destinos/puno" element={<DestinoDetalle3 />} />
          <Route path="/destinos/ica" element={<DestinoDetalle1 />} />
          <Route path="/destinos/huaraz" element={<DestinoDetalle2 />} />
          <Route path="/destinos/manu" element={<DestinoDetalle3 />} />

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

          {/* Mis Reservas (protegida) */}
          <Route 
            path="/mis-reservas" 
            element={
              <ProtectedRoute>
                <MyBookings />
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

        {/* Dashboard de admin (sin Layout) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
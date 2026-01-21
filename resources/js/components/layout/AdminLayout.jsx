import React from 'react';

import { useState } from 'react';

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import {
  IoHome,
  IoMapOutline,
  IoCalendarOutline,
  IoCubeOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoStatsChartOutline,
  IoDocumentTextOutline,
  IoCompassOutline,
  IoMenu,
  IoClose
} from 'react-icons/io5';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: IoHome },
  { name: 'Destinos', href: '/admin/destinations', icon: IoCompassOutline }, // AGREGAR
  { name: 'Tours', href: '/admin/tours', icon: IoMapOutline },
  { name: 'Reservas', href: '/admin/bookings', icon: IoCalendarOutline },
  { name: 'Paquetes', href: '/admin/packages', icon: IoCubeOutline },
  { name: 'Actividades', href: '/admin/activities', icon: IoCompassOutline },
  { name: 'Blogs', href: '/admin/blogs', icon: IoDocumentTextOutline },
  { name: 'Usuarios', href: '/admin/users', icon: IoPersonOutline },
  { name: 'Estadísticas', href: '/admin/stats', icon: IoStatsChartOutline },
];

function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
      navigate('/login'); // redirige al login tras cerrar sesión
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-pm-black border-b border-white/10 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg"
              >
                {sidebarOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
              </button>

              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/logo-peru-mysterious-blanco.png"
                  alt="Perú Mysterious"
                  className="h-8 w-auto"
                />
              </Link>
              <span className="text-white/60 text-sm hidden md:block">
                Panel de Administración
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm hidden md:block"
              >
                Ver Sitio
              </Link>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 bg-pm-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden md:block">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <IoLogOutOutline size={18} />
                <span className="hidden md:block">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] sticky top-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href ||
                             (item.href !== '/admin' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-pm-gold text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <aside className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <div
              className="bg-white w-64 h-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href ||
                                 (item.href !== '/admin' && location.pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-pm-gold text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

// src/pages/admin/stats/BookingsStatsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import StatCard from "@/components/admin/dashboard/StatCard";
import SalesTrendChart from '@/components/admin/ventas/SalesTrendChart';
import TopToursChart from '@/components/admin/ventas/TopToursChart';
import IncomeComparison from '@/components/admin/ventas/IncomeComparison';
import PaymentsHistory from '@/components/admin/ventas/PaymentsHistory';
import {
  FaDollarSign,
  FaExchangeAlt,
  FaMapMarkedAlt,
  FaPercentage
} from 'react-icons/fa';

const BookingsStatsPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('hoy');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/bookings/stats');
      const statsData = response.data?.data || {};
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  // Calcular estadísticas dinámicas
  const totalRevenue = stats?.total_revenue || 0;
  const totalBookings = stats?.total_bookings || 0;
  const confirmedBookings = stats?.confirmed || 0;
  const conversionRate = totalBookings > 0
    ? ((confirmedBookings / totalBookings) * 100).toFixed(1)
    : 0;

  const salesCardsData = {
    ventas: {
      value: `S/. ${totalRevenue.toFixed(2)}`,
      change: 'Total generado',
      type: 'positive'
    },
    transacciones: {
      value: `${totalBookings}`,
      change: `${stats?.pending || 0} pendientes`,
      type: totalBookings > 0 ? 'positive' : 'neutral'
    },
    tours: {
      value: `${confirmedBookings}`,
      change: `${stats?.completed || 0} completados`,
      type: confirmedBookings > 0 ? 'positive' : 'neutral'
    },
    conversion: {
      value: `${conversionRate}%`,
      change: 'Reservas confirmadas',
      type: conversionRate > 50 ? 'positive' : 'neutral'
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Estadísticas</h1>
              <p className="text-gray-600 mt-1">Resumen de reservas y ventas</p>
            </div>
            <div className="flex space-x-2 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
              {['hoy', 'semana', 'mes', 'personalizado'].map((range) => (
                <button
                  key={range}
                  onClick={() => setFilter(range)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    filter === range
                      ? 'bg-pm-gold text-white shadow'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              {...salesCardsData.ventas}
              icon={<FaDollarSign />}
              title="Ingresos Totales"
            />
            <StatCard
              {...salesCardsData.transacciones}
              icon={<FaExchangeAlt />}
              title="Total Reservas"
            />
            <StatCard
              {...salesCardsData.tours}
              icon={<FaMapMarkedAlt />}
              title="Tours Confirmados"
            />
            <StatCard
              {...salesCardsData.conversion}
              icon={<FaPercentage />}
              title="Tasa Confirmación"
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Canceladas</h3>
              <p className="text-3xl font-bold text-red-600">{stats?.cancelled || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Reservas canceladas</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Completadas</h3>
              <p className="text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Tours finalizados</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pendientes</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Por confirmar</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Tendencia de Ventas</h3>
              <SalesTrendChart />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Tours Más Vendidos</h3>
              <TopToursChart />
            </div>
          </div>

          {/* Additional Components */}
          <IncomeComparison />
          <PaymentsHistory />
        </div>
      </div>
    </div>
  );
};

export default BookingsStatsPage;

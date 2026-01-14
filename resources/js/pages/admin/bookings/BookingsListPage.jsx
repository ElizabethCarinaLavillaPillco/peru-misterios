// src/pages/admin/bookings/BookingsListPage.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import {
  IoSearch,
  IoCalendarOutline,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoCloseCircle,
  IoCashOutline,
  IoDownloadOutline
} from 'react-icons/io5';

export default function BookingsListPage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      const bookingsData = response.data?.data?.data || response.data?.data || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
      alert('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const updatePaymentStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/payment`, { payment_status: newStatus });
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, payment_status: newStatus } : b
      ));
      alert('Estado de pago actualizado');
    } catch (error) {
      console.error('Error actualizando pago:', error);
      alert('Error al actualizar el estado de pago');
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

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = (b.booking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.booking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || b.payment_status === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
          <p className="text-gray-600 mt-1">
            {filteredBookings.length} reserva{filteredBookings.length !== 1 ? 's' : ''} encontrada{filteredBookings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por código o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
            >
              <option value="all">Todos los pagos</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <IoCalendarOutline size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron reservas' : 'No hay reservas'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Las reservas de clientes aparecerán aquí'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              // Convertir total a número de forma segura
              const totalAmount = parseFloat(booking.total) || 0;

              return (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Info Principal */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={booking.tour?.featured_image || 'https://via.placeholder.com/100'}
                            alt={booking.tour?.name || 'Tour'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-gray-900 font-mono text-sm">
                              {booking.booking_code || booking.booking_number || 'N/A'}
                            </h3>
                            <StatusBadge status={booking.status} />
                            <PaymentBadge status={booking.payment_status} />
                          </div>

                          <p className="text-gray-700 font-medium mb-2">
                            {booking.tour?.name || 'Tour sin nombre'}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <IoPersonOutline size={16} />
                              <span>{booking.user?.name || 'Usuario'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IoCalendarOutline size={16} />
                              <span>
                                {booking.travel_date
                                  ? new Date(booking.travel_date).toLocaleDateString('es-ES')
                                  : 'Fecha no disponible'
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IoPersonOutline size={16} />
                              <span>{booking.number_of_people || 0} persona{booking.number_of_people !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-pm-gold">
                              <IoCashOutline size={16} />
                              <span>S/. {totalAmount.toFixed(2)}</span>
                            </div>
                          </div>

                          {booking.payment_method && (
                            <p className="text-xs text-gray-500 mt-2">
                              Método: {booking.payment_method}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>

                      <select
                        value={booking.payment_status}
                        onChange={(e) => updatePaymentStatus(booking.id, e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                      >
                        <option value="pending">Pago Pendiente</option>
                        <option value="paid">Pagado</option>
                        <option value="refunded">Reembolsado</option>
                      </select>

                      {booking.payment_status === 'paid' && (
                        <button
                          onClick={() => handleDownloadReceipt(booking.id, booking.booking_code)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
                        >
                          <IoDownloadOutline size={16} />
                          Comprobante
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente', icon: IoTimeOutline },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmada', icon: IoCheckmarkCircle },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada', icon: IoCheckmarkCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada', icon: IoCloseCircle },
  };

  const { bg, text, label, icon: Icon } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 ${bg} ${text} rounded-full text-xs font-medium`}>
      <Icon size={14} />
      {label}
    </span>
  );
}

function PaymentBadge({ status }) {
  const config = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pendiente' },
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagado' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Reembolsado' },
  };

  const { bg, text, label } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 ${bg} ${text} rounded-full text-xs font-medium`}>
      <IoCashOutline size={14} />
      {label}
    </span>
  );
}

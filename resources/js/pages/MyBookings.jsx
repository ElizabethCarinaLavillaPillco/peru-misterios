// src/pages/MyBookings.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoCalendarOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoMapOutline,
  IoArrowBack,
  IoDownloadOutline,
  IoEyeOutline
} from 'react-icons/io5';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const paymentStatusLabels = {
  pending: 'Pendiente',
  paid: 'Pagado',
  refunded: 'Reembolsado',
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setError(null);
      const response = await api.get('/my-bookings');
      const bookingsData = response.data?.data || response.data || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setError('Error al cargar las reservas. Intenta nuevamente.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      await api.post(`/bookings/${id}/cancel`, {
        reason: 'Cancelado por el usuario'
      });

      // Recargar bookings
      await loadBookings();
      alert('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error al cancelar:', error);
      alert('Error al cancelar la reserva. Intenta nuevamente.');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/mi-cuenta')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <IoArrowBack size={20} />
            <span>Volver al Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Reservas
              </h1>
              <p className="text-gray-600 mt-1">
                {bookings.length} {bookings.length === 1 ? 'reserva' : 'reservas'} en total
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <IoCalendarOutline size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes reservas aún
            </h2>
            <p className="text-gray-600 mb-8">
              ¡Explora nuestros tours y comienza tu aventura por Perú!
            </p>
            <button
              onClick={() => navigate('/tours')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold hover:bg-pm-gold/90 text-white font-semibold rounded-lg transition-colors"
            >
              <IoMapOutline size={20} />
              Explorar Tours
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Header con Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[booking.status]}`}>
                          {statusLabels[booking.status]}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentStatusColors[booking.payment_status]}`}>
                          {paymentStatusLabels[booking.payment_status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-mono">
                        {booking.booking_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total pagado</p>
                      <p className="text-2xl font-bold text-pm-gold">
                        S/. {parseFloat(booking.total).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Tour Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {booking.tour?.name || 'Tour'}
                    </h3>
                    {booking.tour?.location && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <IoMapOutline size={18} />
                        {booking.tour.location}
                      </p>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IoCalendarOutline size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha de viaje</p>
                        <p className="font-semibold">
                          {new Date(booking.travel_date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IoPeopleOutline size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Personas</p>
                        <p className="font-semibold">{booking.number_of_people}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <IoTimeOutline size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="font-semibold">
                          {booking.tour?.duration_days || 0}D / {booking.tour?.duration_nights || 0}N
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {booking.payment_method && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600">
                        Método de pago: <span className="font-semibold text-gray-900">{booking.payment_method}</span>
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {/* Botón de descargar comprobante - siempre visible */}
                    <button
                      onClick={() => handleDownloadReceipt(booking.id, booking.booking_code)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                        booking.payment_status === 'paid'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-not-allowed opacity-50'
                      }`}
                      disabled={booking.payment_status !== 'paid'}
                      title={booking.payment_status === 'paid' ? 'Descargar comprobante de pago' : 'Comprobante disponible solo para reservas pagadas'}
                    >
                      <IoDownloadOutline size={18} />
                      Descargar Comprobante
                    </button>

                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-semibold"
                      >
                        Cancelar Reserva
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/tours/${booking.tour?.slug || booking.tour?.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-semibold"
                    >
                      <IoEyeOutline size={18} />
                      Ver Tour
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

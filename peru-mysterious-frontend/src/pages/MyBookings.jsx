
// ============================================
// src/pages/MyBookings.jsx
// ============================================

import { useState, useEffect } from 'react';
import { bookingAPI } from '@/lib/api';
import { 
  IoCalendarOutline, 
  IoPeopleOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTimeOutline 
} from 'react-icons/io5';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingAPI.getMyBookings();
      setBookings(data.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      await bookingAPI.cancel(id, 'Cancelado por el usuario');
      loadBookings();
      alert('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error al cancelar:', error);
      alert('Error al cancelar la reserva');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <IoCalendarOutline size={80} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No tienes reservas aún
          </h2>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestros tours y comienza tu aventura!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mis Reservas ({bookings.length})
        </h1>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">
                    {booking.booking_number}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    {booking.tour.name}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[booking.status]}`}>
                  {statusLabels[booking.status]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <IoCalendarOutline />
                  <span>
                    {new Date(booking.travel_date).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <IoPeopleOutline />
                  <span>{booking.number_of_people} persona(s)</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <IoTimeOutline />
                  <span>{booking.tour.duration_days}D / {booking.tour.duration_nights}N</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <span className="text-gray-600">Total pagado:</span>
                  <p className="text-2xl font-bold text-gray-800">
                    ${booking.total}
                  </p>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
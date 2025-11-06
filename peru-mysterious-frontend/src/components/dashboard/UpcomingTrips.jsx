import { useState } from 'react';

import { Link } from 'react-router-dom';
export default function UpcomingTrips({ bookings = [] }) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Próximos Viajes
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✈️</div>
          <p className="text-gray-500 mb-4">No tienes viajes programados</p>
          <Link
            href="/paquetes"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Explorar Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Próximos Viajes
        </h3>
        <Link href="/mi-cuenta/reservas" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
          Ver todas →
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex gap-4">
              {/* Imagen */}
              <div className="flex-shrink-0">
                <img
                  src={booking.tour.cover_image || '/images/tour-placeholder.jpg'}
                  alt={booking.tour.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {booking.tour.title}
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  {booking.tour.duration} • {booking.tour.category}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    📅 {new Date(booking.dates.start).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-gray-600">
                    👥 {booking.travelers.total} personas
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex-shrink-0 text-right">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  booking.status.is_confirmed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status.booking === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                </span>
                <p className="text-sm font-bold text-gray-800 mt-2">
                  ${booking.amount.total}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Link
                href={`/mi-cuenta/reservas/${booking.id}`}
                className="flex-1 py-2 px-4 bg-blue-600 text-white text-center text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Ver Detalles
              </Link>
              {booking.status.can_be_cancelled && (
                <button className="px-4 py-2 border border-red-500 text-red-500 text-sm rounded-lg hover:bg-red-50 transition">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
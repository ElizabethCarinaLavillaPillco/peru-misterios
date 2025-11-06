import { useState } from 'react';
// frontend/src/components/dashboard/RecentTrips.jsx
import { Link } from 'react-router-dom';
export default function RecentTrips({ bookings = [] }) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Viajes Anteriores
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No tienes viajes completados aún</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Viajes Anteriores
        </h3>
        <Link href="/mi-cuenta/historial" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
          Ver todo →
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex gap-4">
              <img
                src={booking.tour.cover_image || '/images/tour-placeholder.jpg'}
                alt={booking.tour.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {booking.tour.title}
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(booking.dates.start).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                  Dejar reseña →
                </button>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  Completado
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
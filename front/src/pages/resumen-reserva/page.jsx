// =============================================================
// ARCHIVO: src/pages/resumen-reserva/page.jsx (PÁGINA DE RESUMEN POST-PAGO)
// =============================================================

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoCheckmarkCircle, IoDownload, IoHome, IoReceipt } from 'react-icons/io5';

export default function ResumenReservaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí cargarías los detalles de la reserva desde el backend
    const fetchBooking = async () => {
      try {
        // Simulación - reemplazar con llamada real a la API
        setTimeout(() => {
          setBooking({
            id: bookingId || '12345',
            booking_number: 'PM-ABC123',
            tour_name: 'Camino Inca a Machu Picchu',
            travel_date: '2025-12-15',
            number_of_people: 2,
            price_per_person: 450,
            subtotal: 900,
            tax: 162,
            total: 1062,
            payment_status: 'paid',
            payment_method: 'Tarjeta de Crédito',
            created_at: new Date().toISOString()
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error cargando reserva:', error);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reserva no encontrada
          </h2>
          <button
            onClick={() => navigate('/mis-reservas')}
            className="text-pm-gold hover:underline"
          >
            Ver mis reservas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Mensaje de éxito */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <IoCheckmarkCircle size={60} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-xl text-gray-600">
            Tu reserva ha sido procesada exitosamente
          </p>
        </div>

        {/* Detalles de la reserva */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-pm-gold to-amber-600 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Número de reserva</p>
                <p className="text-2xl font-bold">{booking.booking_number}</p>
              </div>
              <IoReceipt size={40} />
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {booking.tour_name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha de viaje</p>
                <p className="font-semibold text-gray-900">
                  {new Date(booking.travel_date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Personas</p>
                <p className="font-semibold text-gray-900">
                  {booking.number_of_people} {booking.number_of_people === 1 ? 'persona' : 'personas'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Precio por persona</span>
                <span>${booking.price_per_person.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({booking.number_of_people} personas)</span>
                <span>${booking.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>IGV (18%)</span>
                <span>${booking.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t-2">
                <span>Total pagado</span>
                <span className="text-pm-gold">${booking.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Método de pago:</span> {booking.payment_method}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Estado:</span>{' '}
                <span className="text-green-600 font-semibold">Pagado</span>
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Importante:</span> Hemos enviado la confirmación 
                de tu reserva a tu correo electrónico. Por favor, revisa tu bandeja de entrada 
                y spam.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/mis-reservas')}
            className="flex-1 flex items-center justify-center gap-2 bg-pm-gold text-white px-6 py-4 rounded-lg font-semibold hover:bg-pm-gold/90 transition-colors"
          >
            <IoReceipt size={20} />
            Ver mis reservas
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <IoDownload size={20} />
            Descargar recibo
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <IoHome size={20} />
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
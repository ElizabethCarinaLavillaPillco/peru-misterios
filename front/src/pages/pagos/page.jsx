// =============================================================
// ARCHIVO: src/pages/pagos/page.jsx (ACTUALIZADO CON CARRITO REAL)
// =============================================================

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import api from "@/lib/api";
import Stepper from "@/components/sections/pago/Stepper";
import PaymentMethods from "@/components/sections/pago/PaymentMethods";
import TravelerForm from "@/components/sections/pago/TravelerForm";

export default function PagoPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, loadCart, clearCart, getTotals } = useCartStore();
  
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [travelerData, setTravelerData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadCart().then(() => setLoading(false));
  }, [isAuthenticated]);

  const { subtotal, tax, total } = getTotals();

  const handlePay = async () => {
    if (items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setProcessing(true);

    try {
      // Crear reservas para cada item del carrito
      const bookingPromises = items.map(item => 
        api.post('/bookings', {
          tour_id: item.tour_id,
          travel_date: item.travel_date,
          number_of_people: item.number_of_people,
        })
      );

      const bookings = await Promise.all(bookingPromises);
      
      // Simular pago exitoso
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Actualizar estado de pago de las reservas
      for (const booking of bookings) {
        await api.put(`/admin/bookings/${booking.data.data.id}/payment`, {
          payment_status: 'paid',
          payment_method: method === 'card' ? 'Tarjeta de Crédito' : 
                         method === 'paypal' ? 'PayPal' : 'Transferencia Bancaria'
        });

        await api.put(`/admin/bookings/${booking.data.data.id}/status`, {
          status: 'confirmed'
        });
      }

      // Limpiar carrito
      await clearCart();

      // Redirigir a resumen
      const firstBookingId = bookings[0].data.data.id;
      navigate(`/resumen-reserva?booking=${firstBookingId}`);
      
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            Agrega tours a tu carrito para proceder con el pago
          </p>
          <button
            onClick={() => navigate('/tours')}
            className="bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold"
          >
            Explorar Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      <Stepper current={step} onGoTo={setStep} />

      {/* PASO 1: DATOS DEL VIAJERO */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <TravelerForm
            user={travelerData}
            onUpdateUser={setTravelerData}
            onNext={() => setStep(2)}
          />

          {/* Resumen del Carrito */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Resumen de tu Reserva
            </h3>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.tour?.featured_image || 'https://via.placeholder.com/100'}
                    alt={item.tour?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.tour?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(item.travel_date).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.number_of_people} persona{item.number_of_people !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>IGV (18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-pm-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-pm-gold text-white py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold"
            >
              Continuar al Pago
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: MÉTODO DE PAGO */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <PaymentMethods
            selected={method}
            onSelect={setMethod}
            user={travelerData}
            onUpdateUser={setTravelerData}
          />

          {/* Resumen Final */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Resumen del Pago
            </h3>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-700">
                  <span>{item.tour?.name}</span>
                  <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>IGV (18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t-2">
                <span>Total a Pagar</span>
                <span className="text-pm-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Método de pago:</span>{' '}
                {method === 'card' && 'Tarjeta de Crédito/Débito'}
                {method === 'paypal' && 'PayPal'}
                {method === 'transfer' && 'Transferencia Bancaria'}
              </p>
              <p className="text-sm text-blue-800 mt-1">
                <span className="font-semibold">Nombre:</span> {travelerData.name}
              </p>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Procesando pago...
                </>
              ) : (
                <>
                  🔒 Pagar ${total.toFixed(2)}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Al confirmar el pago, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
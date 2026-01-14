// src/pages/pagos/page.jsx
import React from 'react';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import api from "@/lib/api";
import {
  IoCheckmarkCircle,
  IoCardOutline,
  IoLogoPaypal,
  IoCashOutline,
  IoArrowBack,
  IoShieldCheckmark,
  IoLockClosed,
  IoAlertCircle,
  IoRefresh,
  IoPhonePortraitOutline
} from "react-icons/io5";

const paymentMethods = [
  {
    id: "paypal",
    label: "PayPal",
    icon: IoLogoPaypal,
    active: true,
    description: "Paga de forma segura con tu cuenta PayPal"
  },
  {
    id: "yape_plin",
    label: "Yape / Plin",
    icon: IoPhonePortraitOutline,
    active: true,
    description: "Pago simulado para pruebas"
  },
  {
    id: "card",
    label: "Tarjeta de Crédito/Débito",
    icon: IoCardOutline,
    active: false,
    description: "Próximamente disponible"
  },
  {
    id: "transfer",
    label: "Transferencia Bancaria",
    icon: IoCashOutline,
    active: false,
    description: "Próximamente disponible"
  },
];

export default function PagoPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, loadCart, clearCart, getTotals } = useCartStore();

  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("paypal");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState(null);
  const [travelerData, setTravelerData] = useState({
    name: "",
    email: "",
    phone: "",
    document_type: "dni",
    document_number: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setTravelerData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      document_type: "dni",
      document_number: "",
    });

    loadCart().then(() => setLoading(false));
  }, [isAuthenticated, user, navigate, loadCart]);

  const safeItems = Array.isArray(items) ? items : [];
  const totals = getTotals();
  const subtotal = totals?.subtotal || 0;
  const tax = totals?.tax || 0;
  const total = totals?.total || 0;

  // Crear orden de PayPal
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2),
            currency_code: "USD",
          },
          description: `Reserva de Tours - Peru Mysterious`,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        brand_name: "Peru Mysterious",
        locale: "es-PE",
      },
    });
  };

  // Manejar aprobación de PayPal
  const onApprove = async (data, actions) => {
    setProcessing(true);
    setPaypalError(null);

    try {
      // Validar que actions y actions.order existan
      if (!actions || !actions.order) {
        throw new Error('PayPal actions no disponibles');
      }

      const details = await actions.order.capture();

      // Crear reservas
      const bookingPromises = safeItems.map(item =>
        api.post('/bookings', {
          tour_id: item.tour_id,
          travel_date: item.travel_date,
          number_of_people: item.number_of_people,
        })
      );

      const bookings = await Promise.all(bookingPromises);

      // Actualizar estado de pago
      for (const booking of bookings) {
        const bookingId = booking.data?.data?.id;
        if (bookingId) {
          await api.put(`/admin/bookings/${bookingId}/payment`, {
            payment_status: 'paid',
            payment_method: 'PayPal',
          }).catch(console.warn);

          await api.put(`/admin/bookings/${bookingId}/status`, {
            status: 'confirmed'
          }).catch(console.warn);
        }
      }

      await clearCart();

      const firstBookingId = bookings[0]?.data?.data?.id;
      const totalPaid = total;
      const bookingsCount = bookings.length;

      navigate('/resumen-reserva', {
        state: {
          bookingId: firstBookingId,
          totalPaid: totalPaid,
          bookingsCount: bookingsCount,
          paymentMethod: 'PayPal'
        }
      });

    } catch (error) {
      console.error('Error:', error);
      setPaypalError('Error al procesar la reserva. Contacta a soporte.');
    } finally {
      setProcessing(false);
    }
  };

  // Manejar pago simulado (Yape/Plin)
  const handleSimulatedPayment = async () => {
    setProcessing(true);
    setPaypalError(null);

    try {
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear reservas
      const bookingPromises = safeItems.map(item =>
        api.post('/bookings', {
          tour_id: item.tour_id,
          travel_date: item.travel_date,
          number_of_people: item.number_of_people,
        })
      );

      const bookings = await Promise.all(bookingPromises);

      // Actualizar estado de pago
      for (const booking of bookings) {
        const bookingId = booking.data?.data?.id;
        if (bookingId) {
          await api.put(`/admin/bookings/${bookingId}/payment`, {
            payment_status: 'paid',
            payment_method: 'Yape/Plin (Simulado)',
          }).catch(console.warn);

          await api.put(`/admin/bookings/${bookingId}/status`, {
            status: 'confirmed'
          }).catch(console.warn);
        }
      }

      await clearCart();

      const firstBookingId = bookings[0]?.data?.data?.id;
      const totalPaid = total;
      const bookingsCount = bookings.length;

      navigate('/resumen-reserva', {
        state: {
          bookingId: firstBookingId,
          totalPaid: totalPaid,
          bookingsCount: bookingsCount,
          paymentMethod: 'Yape/Plin'
        }
      });

    } catch (error) {
      console.error('Error:', error);
      setPaypalError('Error al procesar la reserva. Intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    setPaypalError('Error con PayPal. Intenta nuevamente.');
  };

  const onCancel = () => {
    setPaypalError('Has cancelado el pago.');
  };

  const validateStep1 = () => {
    if (!travelerData.name.trim()) {
      alert('Ingresa tu nombre completo');
      return false;
    }
    if (!travelerData.email.trim()) {
      alert('Ingresa tu email');
      return false;
    }
    if (!travelerData.phone.trim()) {
      alert('Ingresa tu teléfono');
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <IoCardOutline size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrito vacío</h2>
          <p className="text-gray-600 mb-6">Agrega tours para continuar</p>
          <button onClick={() => navigate('/tours')} className="bg-pm-gold text-white px-6 py-3 rounded-lg font-semibold">
            Explorar Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <IoArrowBack size={20} />
            <span>Volver al carrito</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <StepIndicator number={1} label="Datos" active={step >= 1} completed={step > 1} />
            <div className={`w-16 h-1 rounded ${step > 1 ? 'bg-pm-gold' : 'bg-gray-300'}`} />
            <StepIndicator number={2} label="Pago" active={step >= 2} completed={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2">
            {/* PASO 1 */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Datos del Viajero</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                    <input type="text" value={travelerData.name} onChange={(e) => setTravelerData({...travelerData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={travelerData.email} onChange={(e) => setTravelerData({...travelerData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold" placeholder="tu@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input type="tel" value={travelerData.phone} onChange={(e) => setTravelerData({...travelerData, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold" placeholder="+51 999 999 999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                    <select value={travelerData.document_type} onChange={(e) => setTravelerData({...travelerData, document_type: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <option value="dni">DNI</option>
                      <option value="passport">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº Documento</label>
                    <input type="text" value={travelerData.document_number} onChange={(e) => setTravelerData({...travelerData, document_number: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="12345678" />
                  </div>
                </div>
                <button onClick={() => validateStep1() && setStep(2)} className="w-full mt-6 bg-pm-gold text-white py-4 rounded-lg font-bold hover:bg-pm-gold/90">
                  Continuar al Pago
                </button>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Métodos */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Método de Pago</h2>
                  <div className="space-y-3">
                    {paymentMethods.map((m) => {
                      const Icon = m.icon;
                      return (
                        <label key={m.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${method === m.id ? 'border-pm-gold bg-amber-50' : m.active ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'}`}>
                          <input type="radio" name="paymentMethod" value={m.id} checked={method === m.id} onChange={() => m.active && setMethod(m.id)} disabled={!m.active} className="w-5 h-5 text-pm-gold" />
                          <Icon size={28} className={method === m.id ? 'text-pm-gold' : 'text-gray-500'} />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{m.label}</p>
                            <p className="text-sm text-gray-500">{m.description}</p>
                          </div>
                          {method === m.id && m.active && <IoCheckmarkCircle className="text-pm-gold" size={24} />}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* PayPal Section */}
                {method === "paypal" && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <IoLogoPaypal className="text-blue-600" size={24} />
                      Pagar con PayPal
                    </h3>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <IoShieldCheckmark className="text-blue-600 mt-0.5" size={20} />
                        <p className="text-sm text-blue-800">Pago seguro. Serás redirigido a PayPal.</p>
                      </div>
                    </div>

                    {paypalError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <IoAlertCircle className="text-red-600" size={20} />
                          <p className="text-sm text-red-800">{paypalError}</p>
                        </div>
                      </div>
                    )}

                    {isPending && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pm-gold mx-auto"></div>
                        <p className="mt-3 text-gray-600">Cargando PayPal...</p>
                      </div>
                    )}

                    {isRejected && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <IoAlertCircle className="text-red-500 mx-auto mb-2" size={32} />
                        <p className="text-red-800 font-semibold mb-2">Error al cargar PayPal</p>
                        <p className="text-sm text-red-600 mb-4">Verifica tu conexión o intenta más tarde.</p>
                        <button onClick={() => window.location.reload()} className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          <IoRefresh size={18} />
                          Recargar página
                        </button>
                      </div>
                    )}

                    {processing && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-3 text-gray-600">Procesando tu reserva...</p>
                      </div>
                    )}

                    {isResolved && !processing && (
                      <div className="paypal-button-container">
                        <PayPalButtons
                          style={{
                            layout: 'vertical',
                            color: 'gold',
                            shape: 'rect',
                            label: 'paypal',
                            height: 50,
                          }}
                          disabled={false}
                          forceReRender={[total]}
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                          onCancel={onCancel}
                        />
                      </div>
                    )}

                    <button onClick={() => setStep(1)} className="w-full mt-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      ← Volver
                    </button>
                  </div>
                )}

                {/* Yape/Plin Section (Simulado) */}
                {method === "yape_plin" && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <IoPhonePortraitOutline className="text-purple-600" size={24} />
                      Pagar con Yape / Plin (Simulado)
                    </h3>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <IoAlertCircle className="text-purple-600 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm text-purple-800 font-semibold mb-1">
                            Modo de prueba activado
                          </p>
                          <p className="text-sm text-purple-700">
                            Este es un pago simulado para pruebas. Al confirmar, tu reserva será procesada automáticamente.
                          </p>
                        </div>
                      </div>
                    </div>

                    {paypalError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <IoAlertCircle className="text-red-600" size={20} />
                          <p className="text-sm text-red-800">{paypalError}</p>
                        </div>
                      </div>
                    )}

                    {processing ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="mt-3 text-gray-600">Procesando tu pago simulado...</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 mb-6 text-white">
                          <div className="text-center">
                            <IoPhonePortraitOutline size={48} className="mx-auto mb-3" />
                            <p className="text-sm mb-2">Total a pagar</p>
                            <p className="text-3xl font-bold">S/. {total.toFixed(2)}</p>
                          </div>
                        </div>

                        <button
                          onClick={handleSimulatedPayment}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all mb-4"
                        >
                          Confirmar Pago Simulado
                        </button>

                        <button onClick={() => setStep(1)} className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                          ← Volver
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">Resumen</h3>
              <div className="space-y-3 mb-4">
                {safeItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.tour?.featured_image || 'https://via.placeholder.com/60'} alt="" className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.tour?.name}</p>
                      <p className="text-xs text-gray-500">{item.number_of_people} pers.</p>
                    </div>
                    <p className="font-bold text-sm">S/. {(parseFloat(item.subtotal) || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span>S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>IGV (18%)</span>
                  <span>S/. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-pm-gold">S/. {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-500">
                <IoLockClosed className="text-green-600" />
                <span>Pago 100% seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${completed ? 'bg-green-500 text-white' : active ? 'bg-pm-gold text-white' : 'bg-gray-200 text-gray-500'}`}>
        {completed ? <IoCheckmarkCircle size={24} /> : number}
      </div>
      <span className={`text-sm mt-1 font-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}

// src/pages/pagos/page.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import api from "@/lib/api";
import PayPalButton from "@/components/admin/ventas/PayPalButton";
import {
  IoCheckmarkCircle,
  IoCardOutline,
  IoLogoPaypal,
  IoCashOutline,
  IoArrowBack,
  IoShieldCheckmark,
  IoLockClosed
} from "react-icons/io5";

// ⚠️ IMPORTANTE: Reemplaza con tu Client ID de PayPal
const PAYPAL_CLIENT_ID = "MGNih1BLxu2fCSZcnKTs0dIlM9cJliybfNSCkBhXAdZE5beCjPgo-CXS3DlDNecgJPf7ibQiT5BLGRyH";

const paymentMethods = [
  { 
    id: "paypal", 
    label: "PayPal", 
    icon: IoLogoPaypal, 
    active: true,
    description: "Paga de forma segura con tu cuenta PayPal"
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
  
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("paypal");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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
    
    // Cargar datos del usuario
    setTravelerData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      document_type: "dni",
      document_number: "",
    });

    loadCart().then(() => setLoading(false));
  }, [isAuthenticated, user]);

  const safeItems = Array.isArray(items) ? items : [];
  const totals = getTotals();
  const subtotal = totals?.subtotal || 0;
  const tax = totals?.tax || 0;
  const total = totals?.total || 0;

  // Manejar pago exitoso de PayPal
  const handlePayPalSuccess = async (details) => {
    setProcessing(true);
    
    try {
      // Crear reservas para cada item del carrito
      const bookingPromises = safeItems.map(item => 
        api.post('/bookings', {
          tour_id: item.tour_id,
          travel_date: item.travel_date,
          number_of_people: item.number_of_people,
        })
      );

      const bookings = await Promise.all(bookingPromises);
      
      // Actualizar estado de pago de las reservas
      for (const booking of bookings) {
        const bookingId = booking.data?.data?.id;
        if (bookingId) {
          // Actualizar pago
          await api.put(`/admin/bookings/${bookingId}/payment`, {
            payment_status: 'paid',
            payment_method: 'PayPal',
            transaction_id: details.id,
          }).catch(err => console.warn('Error actualizando pago:', err));

          // Confirmar reserva
          await api.put(`/admin/bookings/${bookingId}/status`, {
            status: 'confirmed'
          }).catch(err => console.warn('Error confirmando reserva:', err));
        }
      }

      // Limpiar carrito
      await clearCart();

      // Redirigir a página de éxito
      const firstBookingId = bookings[0]?.data?.data?.id;
      navigate(`/resumen-reserva?booking=${firstBookingId}&payment=success`);
      
    } catch (error) {
      console.error('Error procesando reservas:', error);
      alert('El pago fue exitoso pero hubo un error creando las reservas. Contacta a soporte.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayPalError = (error) => {
    console.error('Error en PayPal:', error);
    alert('Error al procesar el pago con PayPal. Por favor intenta nuevamente.');
  };

  const validateStep1 = () => {
    if (!travelerData.name.trim()) {
      alert('Por favor ingresa tu nombre completo');
      return false;
    }
    if (!travelerData.email.trim()) {
      alert('Por favor ingresa tu email');
      return false;
    }
    if (!travelerData.phone.trim()) {
      alert('Por favor ingresa tu teléfono');
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <IoCardOutline size={40} className="text-gray-400" />
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
    <PayPalScriptProvider options={{ 
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture"
    }}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
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
              <StepIndicator number={2} label="Pago" active={step >= 2} completed={step > 2} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido Principal */}
            <div className="lg:col-span-2">
              {/* PASO 1: DATOS DEL VIAJERO */}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-pm-gold text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Datos del Viajero Principal
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={travelerData.name}
                        onChange={(e) => setTravelerData({...travelerData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={travelerData.email}
                        onChange={(e) => setTravelerData({...travelerData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={travelerData.phone}
                        onChange={(e) => setTravelerData({...travelerData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                        placeholder="+51 999 999 999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Documento
                      </label>
                      <select
                        value={travelerData.document_type}
                        onChange={(e) => setTravelerData({...travelerData, document_type: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                      >
                        <option value="dni">DNI</option>
                        <option value="passport">Pasaporte</option>
                        <option value="ce">Carnet de Extranjería</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Documento
                      </label>
                      <input
                        type="text"
                        value={travelerData.document_number}
                        onChange={(e) => setTravelerData({...travelerData, document_number: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                        placeholder="12345678"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => validateStep1() && setStep(2)}
                    className="w-full mt-6 bg-pm-gold text-white py-4 rounded-lg hover:bg-pm-gold/90 transition-colors font-bold"
                  >
                    Continuar al Pago
                  </button>
                </div>
              )}

              {/* PASO 2: MÉTODO DE PAGO */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Métodos de pago */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-pm-gold text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      Método de Pago
                    </h2>

                    <div className="space-y-3">
                      {paymentMethods.map((m) => {
                        const Icon = m.icon;
                        return (
                          <label
                            key={m.id}
                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              method === m.id
                                ? 'border-pm-gold bg-amber-50'
                                : m.active 
                                  ? 'border-gray-200 hover:border-gray-300'
                                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={m.id}
                              checked={method === m.id}
                              onChange={() => m.active && setMethod(m.id)}
                              disabled={!m.active}
                              className="w-5 h-5 text-pm-gold focus:ring-pm-gold"
                            />
                            <Icon size={28} className={method === m.id ? 'text-pm-gold' : 'text-gray-500'} />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{m.label}</p>
                              <p className="text-sm text-gray-500">{m.description}</p>
                            </div>
                            {method === m.id && m.active && (
                              <IoCheckmarkCircle className="text-pm-gold" size={24} />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Botón de PayPal */}
                  {method === "paypal" && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Pagar con PayPal
                      </h3>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <IoShieldCheckmark className="text-blue-600 mt-0.5" size={20} />
                          <div className="text-sm text-blue-800">
                            <p className="font-semibold">Pago seguro con PayPal</p>
                            <p>Tu información financiera está protegida. Serás redirigido a PayPal para completar el pago.</p>
                          </div>
                        </div>
                      </div>

                      {processing ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto"></div>
                          <p className="mt-4 text-gray-600">Procesando tu reserva...</p>
                        </div>
                      ) : (
                        <PayPalButton
                          amount={total}
                          onSuccess={handlePayPalSuccess}
                          onError={handlePayPalError}
                        />
                      )}

                      <button
                        onClick={() => setStep(1)}
                        className="w-full mt-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        ← Volver a datos del viajero
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
                  Resumen de tu Reserva
                </h3>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {safeItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.tour?.featured_image || 'https://via.placeholder.com/80'}
                        alt={item.tour?.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {item.tour?.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(item.travel_date).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.number_of_people} persona{item.number_of_people !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        ${(parseFloat(item.subtotal) || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IGV (18%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-pm-gold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Seguridad */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <IoLockClosed className="text-green-600" />
                    <span>Pago 100% seguro y encriptado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

// Componente auxiliar para el stepper
function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
        completed 
          ? 'bg-green-500 text-white' 
          : active 
            ? 'bg-pm-gold text-white' 
            : 'bg-gray-200 text-gray-500'
      }`}>
        {completed ? <IoCheckmarkCircle size={24} /> : number}
      </div>
      <span className={`text-sm mt-1 font-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
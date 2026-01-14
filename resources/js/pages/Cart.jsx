// src/pages/Cart.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import {
  IoTrashOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoArrowForward,
  IoCartOutline,
  IoLocationOutline
} from 'react-icons/io5';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, loadCart, updateQuantity, removeItem, getTotals, loading } = useCartStore();
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      alert('Error al actualizar cantidad');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm('¿Eliminar este tour del carrito?')) return;
    setUpdating(itemId);
    try {
      await removeItem(itemId);
    } catch (error) {
      alert('Error al eliminar item');
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckout = () => {
    if (!items || items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    navigate('/pagos');
  };

  // Obtener totales de forma segura
  const totals = getTotals();
  const subtotal = totals?.subtotal || 0;
  const tax = totals?.tax || 0;
  const total = totals?.total || 0;

  // Asegurar que items sea un array
  const safeItems = Array.isArray(items) ? items : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-50 rounded-full mb-6">
              <IoCartOutline size={48} className="text-pm-gold" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              ¡Explora nuestros increíbles tours y comienza tu aventura por el Perú!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tours"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-pm-gold hover:bg-pm-gold/90 text-white font-bold rounded-lg transition-colors"
              >
                Explorar Tours
                <IoArrowForward size={20} />
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-white font-bold rounded-lg transition-colors"
              >
                Ver Paquetes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
          <p className="text-gray-600 mt-2">
            {safeItems.length} {safeItems.length === 1 ? 'tour' : 'tours'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Items */}
          <div className="lg:col-span-2 space-y-4">
            {safeItems.map((item) => {
              const tour = item.tour || {};
              const itemSubtotal = parseFloat(item.subtotal) || 0;
              const pricePerPerson = parseFloat(item.price_per_person) || 0;
              
              return (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all ${
                    updating === item.id ? 'opacity-60' : ''
                  }`}
                >
                  <div className="md:flex">
                    {/* Imagen */}
                    <div className="md:flex-shrink-0 relative">
                      <img
                        src={tour.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400'}
                        alt={tour.name || 'Tour'}
                        className="h-48 w-full md:w-48 object-cover"
                      />
                      {tour.discount_price && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          OFERTA
                        </span>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link
                            to={`/tours/${tour.slug || item.tour_id}`}
                            className="text-xl font-bold text-gray-900 hover:text-pm-gold transition-colors line-clamp-1"
                          >
                            {tour.name || 'Tour'}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <IoCalendarOutline className="text-pm-gold" />
                              {tour.duration_days || 1}D / {tour.duration_nights || 0}N
                            </span>
                            {tour.location && (
                              <span className="flex items-center gap-1">
                                <IoLocationOutline className="text-pm-gold" />
                                {tour.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-pm-gold">
                            ${itemSubtotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${pricePerPerson.toFixed(2)} /persona
                          </p>
                        </div>
                      </div>

                      {/* Info de la reserva */}
                      <div className="flex flex-wrap gap-4 mb-4 py-3 px-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <IoCalendarOutline className="text-blue-600" size={18} />
                          <div>
                            <span className="text-gray-500">Fecha:</span>
                            <span className="ml-1 font-semibold text-gray-900">
                              {new Date(item.travel_date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IoPeopleOutline className="text-green-600" size={18} />
                          <div>
                            <span className="text-gray-500">Viajeros:</span>
                            <span className="ml-1 font-semibold text-gray-900">
                              {item.number_of_people} persona{item.number_of_people > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controles */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.number_of_people - 1)}
                              disabled={updating === item.id || item.number_of_people <= 1}
                              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-semibold bg-white">
                              {item.number_of_people}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.number_of_people + 1)}
                              disabled={updating === item.id}
                              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 font-bold transition disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updating === item.id}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          <IoTrashOutline size={18} />
                          <span className="hidden sm:inline font-medium">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                Resumen de Compra
              </h3>

              {/* Items resumidos */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {safeItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1 mr-2">
                      {item.tour?.name || 'Tour'} x{item.number_of_people}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${(parseFloat(item.subtotal) || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-3 py-4 border-t border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>IGV (18%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-pm-gold">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-pm-gold hover:bg-pm-gold/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Proceder al Pago
                <IoArrowForward size={20} />
              </button>

              <Link
                to="/tours"
                className="block w-full py-3 mt-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition"
              >
                Seguir Explorando
              </Link>

              {/* Seguridad */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>🔒</span>
                  <span>Pago 100% seguro con PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
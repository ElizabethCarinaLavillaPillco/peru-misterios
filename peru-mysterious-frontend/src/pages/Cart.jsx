// ============================================
// src/pages/Cart.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '@/lib/api';
import { IoTrashOutline, IoCartOutline } from 'react-icons/io5';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartAPI.get();
      setCart(data);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await cartAPI.remove(id);
      loadCart();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      await cartAPI.update(id, quantity);
      loadCart();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      await cartAPI.checkout();
      alert('¡Reservas creadas exitosamente!');
      navigate('/mi-cuenta/reservas');
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al procesar las reservas');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <IoCartOutline size={80} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            ¡Agrega tours increíbles para comenzar tu aventura!
          </p>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Ver Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mi Carrito ({cart.items.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex gap-4">
                  <img
                    src={item.tour.featured_image}
                    alt={item.tour.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 mb-1">
                      {item.tour.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Fecha: {new Date(item.travel_date).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.number_of_people - 1)}
                          disabled={item.number_of_people <= 1}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.number_of_people}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.number_of_people + 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-lg font-bold text-gray-800">
                        ${(item.tour.final_price * item.number_of_people).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IoTrashOutline size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${cart.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IGV (18%)</span>
                  <span className="font-semibold">${cart.summary.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-pm-gold">${cart.summary.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Proceder al Pago
              </button>

              <button
                onClick={() => navigate('/tours')}
                className="w-full mt-3 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
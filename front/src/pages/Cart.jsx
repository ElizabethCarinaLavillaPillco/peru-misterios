// src/pages/Cart.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import {
  IoTrashOutline,
  IoHeartOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoArrowForward,
  IoCartOutline
} from 'react-icons/io5';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      // TODO: Reemplazar con llamada real a API
      const mockCartItems = [
        {
          id: 1,
          tour_id: 1,
          tour: {
            name: 'Tour Aventura en Cusco',
            featured_image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1',
            slug: 'tour-aventura-cusco',
            duration_days: 4,
            duration_nights: 3,
          },
          travel_date: '2025-12-15',
          number_of_people: 2,
          price_per_person: 450,
          subtotal: 900,
        },
        {
          id: 2,
          tour_id: 2,
          tour: {
            name: 'Valle Sagrado Express',
            featured_image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
            slug: 'valle-sagrado-express',
            duration_days: 1,
            duration_nights: 0,
          },
          travel_date: '2025-12-20',
          number_of_people: 1,
          price_per_person: 120,
          subtotal: 120,
        },
      ];

      setCartItems(mockCartItems);
    } catch (error) {
      console.error('Error cargando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const newSubtotal = item.price_per_person * newQuantity;
          return {
            ...item,
            number_of_people: newQuantity,
            subtotal: newSubtotal,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId) => {
    if (confirm('¿Eliminar este tour del carrito?')) {
      setCartItems(items => items.filter(item => item.id !== itemId));
      // TODO: Llamar API para eliminar del backend
    }
  };

  const moveToFavorites = (itemId) => {
    // TODO: Implementar lógica de favoritos
    alert('Movido a favoritos (función en desarrollo)');
    removeItem(itemId);
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.18; // IGV 18%
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Por favor inicia sesión para continuar');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Redirigir a página de pago
    navigate('/pagos');
  };

  const { subtotal, tax, total } = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <IoCartOutline size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              ¡Explora nuestros increíbles tours y comienza tu aventura!
            </p>
            <Link
              to="/paquetes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-pm-gold hover:bg-pm-gold-dark text-white font-bold rounded-lg transition-colors"
            >
              Explorar Tours
              <IoArrowForward size={20} />
            </Link>
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
            {cartItems.length} {cartItems.length === 1 ? 'tour' : 'tours'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {/* Imagen */}
                  <div className="md:flex-shrink-0">
                    <img
                      src={item.tour.featured_image}
                      alt={item.tour.name}
                      className="h-48 w-full md:w-48 object-cover"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link
                          to={`/paquetes/${item.tour.slug}`}
                          className="text-xl font-bold text-gray-900 hover:text-pm-gold"
                        >
                          {item.tour.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.tour.duration_days}D / {item.tour.duration_nights}N
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          S/ {item.subtotal.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          S/ {item.price_per_person} por persona
                        </p>
                      </div>
                    </div>

                    {/* Detalles de Reserva */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoCalendarOutline className="text-blue-600" size={18} />
                        <span>
                          {new Date(item.travel_date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoPeopleOutline className="text-green-600" size={18} />
                        <span>{item.number_of_people} personas</span>
                      </div>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Personas:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.number_of_people - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.number_of_people}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.number_of_people + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveToFavorites(item.id)}
                          className="p-2 text-gray-600 hover:text-pink-600 transition"
                          title="Mover a favoritos"
                        >
                          <IoHeartOutline size={20} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition"
                          title="Eliminar"
                        >
                          <IoTrashOutline size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Resumen de Compra
              </h3>

              {/* Desglose */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>IGV (18%)</span>
                  <span className="font-semibold">S/ {tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      S/ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de Checkout */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-pm-gold hover:bg-pm-gold-dark text-white font-bold rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
              >
                Proceder al Pago
                <IoArrowForward size={20} />
              </button>

              <Link
                to="/paquetes"
                className="block w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition"
              >
                Seguir Explorando
              </Link>

              {/* Información Adicional */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Cancelación flexible</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Confirmación inmediata</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Soporte 24/7</span>
                </div>
              </div>
            </div>

            {/* Banner de Promoción */}
            <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h4 className="font-bold text-lg mb-2">🎉 ¡Oferta Especial!</h4>
              <p className="text-sm text-blue-100 mb-3">
                Reserva 3 o más tours y obtén 15% de descuento adicional
              </p>
              <button className="w-full py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
                Ver Más Tours
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Recomendaciones */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={`https://images.unsplash.com/photo-${1587595431973 + i}?w=400&h=300&fit=crop`}
                  alt={`Tour ${i}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Tour Recomendado {i}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Desde S/ 350
                  </p>
                  <Link
                    to={`/paquetes/tour-${i}`}
                    className="block w-full py-2 bg-gray-100 text-center text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
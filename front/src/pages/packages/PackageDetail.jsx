// =============================================================
// src/pages/packages/PackageDetail.jsx - CON RESERVA INTEGRADA
// =============================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageAPI } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoPeopleOutline,
  IoCheckmarkCircle,
  IoArrowBack,
  IoCartOutline
} from 'react-icons/io5';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadPackage();
  }, [id]);

  const loadPackage = async () => {
    try {
      const data = await packageAPI.getOne(id);
      setPaquete(data);
    } catch (error) {
      console.error('Error:', error);
      setPaquete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      alert('Selecciona una fecha de viaje');
      return;
    }

    try {
      setAdding(true);
      
      // Agregar el paquete como si fuera un tour
      // El backend debería soportar package_id también, pero por ahora usamos tour_id
      await addToCart({
        tour_id: paquete.id,
        travel_date: selectedDate,
        number_of_people: numberOfPeople,
      });

      alert('¡Paquete agregado al carrito!');
      navigate('/cart');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  if (!paquete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Paquete no encontrado</h2>
          <button
            onClick={() => navigate('/packages')}
            className="px-6 py-3 bg-pm-gold text-white rounded-lg hover:bg-pm-gold/90 font-semibold"
          >
            Ver todos los paquetes
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = paquete.discount_price || paquete.price;
  const subtotal = finalPrice * numberOfPeople;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-semibold"
        >
          <IoArrowBack size={20} />
          Volver
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <img
              src={paquete.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200'}
              alt={paquete.name}
              className="w-full h-full object-cover"
            />
            
            {paquete.discount_price && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                {Math.round(((paquete.price - paquete.discount_price) / paquete.price) * 100)}% OFF
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {paquete.category?.name && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-3">
                    {paquete.category.name}
                  </span>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{paquete.name}</h1>
                <p className="text-xl text-gray-600">{paquete.short_description}</p>
              </div>
              <div className="text-right ml-8">
                {paquete.discount_price ? (
                  <>
                    <p className="text-gray-500 line-through text-lg">${paquete.price}</p>
                    <p className="text-4xl font-bold text-green-600">${paquete.discount_price}</p>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-gray-900">${paquete.price}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">por persona</p>
              </div>
            </div>

            {/* Info rápida */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <IoCalendarOutline className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="font-semibold">{paquete.total_days}D / {paquete.total_nights}N</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <IoPeopleOutline className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Grupo Máximo</p>
                  <p className="font-semibold">{paquete.max_group_size} personas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <IoTimeOutline className="text-purple-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Dificultad</p>
                  <p className="font-semibold capitalize">{paquete.difficulty_level}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            {paquete.description && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {paquete.description}
                </p>
              </div>
            )}

            {/* Incluido / No Incluido */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {paquete.included && paquete.included.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <IoCheckmarkCircle className="text-green-600" />
                      Incluido
                    </h3>
                    <ul className="space-y-2">
                      {paquete.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {paquete.not_included && paquete.not_included.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-red-600">✗</span>
                      No Incluido
                    </h3>
                    <ul className="space-y-2">
                      {paquete.not_included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-red-600 mt-1">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerario */}
            {paquete.itinerary && paquete.itinerary.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerario</h2>
                <div className="space-y-6">
                  {paquete.itinerary.map((dayData) => (
                    <div key={dayData.day} className="border-l-4 border-pm-gold pl-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        📅 Día {dayData.day}
                      </h3>
                      
                      <div className="space-y-4">
                        {dayData.tours.map((tour, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-2">{tour.name}</h4>
                            <p className="text-gray-700 text-sm mb-2">{tour.description}</p>
                            {tour.notes && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                                💡 {tour.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar de Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Reserva Ahora</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Viaje *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Personas *
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={paquete.max_group_size}
                    className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setNumberOfPeople(Math.min(paquete.max_group_size, numberOfPeople + 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Precio por persona</span>
                  <span className="font-semibold">${finalPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Personas</span>
                  <span className="font-semibold">× {numberOfPeople}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 pb-2 border-b">
                  <span className="text-gray-600">IGV (18%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedDate || adding}
                className="w-full py-4 bg-pm-gold hover:bg-pm-gold/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Agregando...
                  </>
                ) : (
                  <>
                    <IoCartOutline size={24} />
                    Agregar al Carrito
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                * Pago seguro • Cancelación flexible
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// =============================================================
// ARCHIVO: src/pages/TourDetail.jsx (CORREGIDO)
// =============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoLocationOutline, 
  IoPeopleOutline,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoStarOutline,
  IoHeart,
  IoHeartOutline,
  IoCart,
  IoArrowBack
} from 'react-icons/io5';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import useFavoritesStore from '@/store/favoritesStore';

export default function TourDetail() {
  const { id } = useParams(); // ← Obtener el parámetro de la URL
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    // Verificar que tenemos un ID válido
    if (!id) {
      setError('ID de tour no válido');
      setLoading(false);
      return;
    }
    loadTour();
  }, [id]);

  const loadTour = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Cargando tour con ID:', id); // Debug
      
      const response = await api.get(`/tours/${id}`);
      
      console.log('Respuesta del tour:', response.data); // Debug
      
      if (response.data.success) {
        setTour(response.data.data);
      } else {
        setError('Tour no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar tour:', error);
      setError(error.response?.data?.message || 'Error al cargar el tour');
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

    if (!travelDate) {
      alert('Por favor selecciona una fecha de viaje');
      return;
    }

    try {
      await addToCart({
        tour_id: tour.id,
        travel_date: travelDate,
        number_of_people: numberOfPeople,
      });
      alert('Tour agregado al carrito exitosamente');
      navigate('/cart');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar favoritos');
      navigate('/login');
      return;
    }

    try {
      await toggleFavorite(tour.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tour...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <IoCloseCircle size={48} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tour no encontrado
          </h2>
          <p className="text-gray-600 mb-8">
            {error || 'El tour que buscas no existe o ha sido eliminado.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Volver
            </button>
            <button
              onClick={() => navigate('/tours')}
              className="px-6 py-3 bg-pm-gold text-white rounded-lg hover:bg-pm-gold/90 font-semibold"
            >
              Ver todos los tours
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fecha mínima (mañana)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const finalPrice = tour.discount_price || tour.price;
  const subtotal = finalPrice * numberOfPeople;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <IoArrowBack size={20} />
          <span className="font-semibold">Volver</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen Principal */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <img
                src={tour.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200'}
                alt={tour.name}
                className="w-full h-full object-cover"
              />
              {tour.is_featured && (
                <div className="absolute top-4 left-4 bg-pm-gold text-black px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ Tour Destacado
                </div>
              )}
              {tour.discount_price && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {Math.round(((tour.price - tour.discount_price) / tour.price) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Info del Tour */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Categoría */}
              {tour.category?.name && (
                <span className="inline-block text-sm text-pm-gold font-semibold uppercase tracking-wide mb-2">
                  {tour.category.name}
                </span>
              )}

              {/* Título */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {tour.name}
              </h1>

              {/* Info rápida */}
              <div className="flex flex-wrap gap-6 text-gray-600 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <IoLocationOutline size={20} className="text-pm-gold" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IoCalendarOutline size={20} className="text-pm-gold" />
                  <span>{tour.duration_days} Días / {tour.duration_nights} Noches</span>
                </div>
                <div className="flex items-center gap-2">
                  <IoPeopleOutline size={20} className="text-pm-gold" />
                  <span>Máx. {tour.max_group_size} personas</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Descripción</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {tour.description}
                </p>
              </div>

              {/* Incluye / No Incluye */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Incluye */}
                {tour.included && tour.included.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      ✅ Incluye
                    </h3>
                    <ul className="space-y-2">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <IoCheckmarkCircle className="text-green-500 flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* No Incluye */}
                {tour.not_included && tour.not_included.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      ❌ No Incluye
                    </h3>
                    <ul className="space-y-2">
                      {tour.not_included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <IoCloseCircle className="text-red-500 flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Itinerario */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerario</h2>
                  <div className="space-y-4">
                    {tour.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-pm-gold pl-4">
                        <h4 className="font-bold text-gray-900 mb-1">
                          Día {day.day}: {day.title}
                        </h4>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar de Reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {/* Precio */}
              <div className="text-center pb-6 border-b">
                {tour.discount_price ? (
                  <>
                    <span className="text-gray-500 line-through text-xl block">
                      ${tour.price}
                    </span>
                    <p className="text-4xl font-bold text-pm-gold">
                      ${tour.discount_price}
                    </p>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-gray-900">
                    ${tour.price}
                  </p>
                )}
                <span className="text-gray-600">por persona</span>
              </div>

              {/* Formulario de Reserva */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de viaje
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={minDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de personas
                  </label>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Math.max(1, Math.min(tour.max_group_size, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={tour.max_group_size}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo {tour.max_group_size} personas
                  </p>
                </div>

                {/* Resumen de precio */}
                <div className="space-y-2 py-4 border-t border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({numberOfPeople} persona{numberOfPeople > 1 ? 's' : ''})</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>IGV (18%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                    <span>Total</span>
                    <span className="text-pm-gold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <button
                  onClick={handleAddToCart}
                  disabled={!travelDate}
                  className="w-full flex items-center justify-center gap-2 bg-pm-gold text-white py-4 rounded-lg hover:bg-pm-gold/90 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoCart size={24} />
                  Reservar Ahora
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  {isFavorite(tour.id) ? (
                    <>
                      <IoHeart size={20} className="text-red-500" />
                      En favoritos
                    </>
                  ) : (
                    <>
                      <IoHeartOutline size={20} />
                      Agregar a favoritos
                    </>
                  )}
                </button>
              </div>

              {/* Dificultad */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Dificultad:</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold capitalize">
                    {tour.difficulty_level === 'easy' && '😊 Fácil'}
                    {tour.difficulty_level === 'moderate' && '🚶 Moderado'}
                    {tour.difficulty_level === 'challenging' && '🥾 Desafiante'}
                    {tour.difficulty_level === 'difficult' && '⛰️ Difícil'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// src/pages/TourDetail.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourAPI, cartAPI } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { 
  IoCalendarOutline, 
  IoLocationOutline, 
  IoPeopleOutline,
  IoStar,
  IoCheckmarkCircle,
  IoCloseCircle 
} from 'react-icons/io5';

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    travel_date: '',
    number_of_people: 1,
  });

  useEffect(() => {
    loadTour();
  }, [slug]);

  const loadTour = async () => {
    try {
      const data = await tourAPI.getOne(slug);
      setTour(data);
    } catch (error) {
      console.error('Error al cargar tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await cartAPI.add(
        tour.id,
        bookingData.travel_date,
        bookingData.number_of_people
      );
      alert('Tour agregado al carrito');
      navigate('/cart');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Tour no encontrado</p>
      </div>
    );
  }

  const total = tour.final_price * bookingData.number_of_people;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6">
          <span className="text-pm-gold font-semibold">{tour.category?.name}</span>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">{tour.name}</h1>
          <div className="flex items-center gap-4 mt-3 text-gray-600">
            <span className="flex items-center gap-1">
              <IoLocationOutline />
              {tour.location}
            </span>
            <span className="flex items-center gap-1">
              <IoCalendarOutline />
              {tour.duration_days}D / {tour.duration_nights}N
            </span>
            {tour.total_reviews > 0 && (
              <span className="flex items-center gap-1">
                <IoStar className="text-amber-500" />
                {tour.rating} ({tour.total_reviews} reseñas)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
            <img
              src={tour.featured_image}
              alt={tour.name}
              className="w-full h-96 object-cover rounded-xl"
            />

            {/* Descripción */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* Incluye / No incluye */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <IoCheckmarkCircle className="text-green-500" />
                  Incluye
                </h3>
                <ul className="space-y-2">
                  {tour.included?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <IoCheckmarkCircle className="text-green-500 mt-1" size={16} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <IoCloseCircle className="text-red-500" />
                  No incluye
                </h3>
                <ul className="space-y-2">
                  {tour.not_included?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <IoCloseCircle className="text-red-500 mt-1" size={16} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <div className="mb-4">
                {tour.discount_price ? (
                  <>
                    <span className="text-gray-500 line-through text-lg">
                      ${tour.price}
                    </span>
                    <p className="text-3xl font-bold text-pm-gold">
                      ${tour.discount_price}
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-gray-800">
                    ${tour.price}
                  </p>
                )}
                <span className="text-gray-600">por persona</span>
              </div>

              {/* Formulario de reserva */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de viaje
                  </label>
                  <input
                    type="date"
                    value={bookingData.travel_date}
                    onChange={(e) => setBookingData({...bookingData, travel_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de personas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={tour.max_group_size}
                    value={bookingData.number_of_people}
                    onChange={(e) => setBookingData({...bookingData, number_of_people: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!bookingData.travel_date}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
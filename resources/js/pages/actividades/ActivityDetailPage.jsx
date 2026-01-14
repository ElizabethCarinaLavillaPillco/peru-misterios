// src/pages/actividades/ActivityDetailPage.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import {
  IoArrowBack,
  IoLocationOutline,
  IoTimeOutline,
  IoPricetagOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoAlertCircle,
  IoInformationCircle,
  IoAddOutline,
  IoRemoveOutline,
  IoCartOutline,
  IoShareSocialOutline,
  IoStarOutline,
} from 'react-icons/io5';

export default function ActivityDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (slug) {
      loadActivity();
    }
  }, [slug]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/activities/${slug}`);
      const activityData = response.data.data || response.data;
      setActivity(activityData);

      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error al cargar actividad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar al carrito');
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      alert('Por favor selecciona una fecha');
      return;
    }

    try {
      await addToCart({
        tour_id: activity.id,
        travel_date: selectedDate,
        number_of_people: numPeople,
      });
      alert('¡Actividad agregada al carrito!');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito');
    }
  };

  const difficultyLabels = {
    easy: 'Fácil',
    moderate: 'Moderado',
    challenging: 'Desafiante',
    difficult: 'Difícil',
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    moderate: 'bg-blue-100 text-blue-800 border-blue-300',
    challenging: 'bg-orange-100 text-orange-800 border-orange-300',
    difficult: 'bg-red-100 text-red-800 border-red-300',
  };

  const daysTranslation = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const calculateTotal = () => {
    if (!activity) return 0;
    const subtotal = parseFloat(activity.price) * numPeople;
    const tax = subtotal * 0.18;
    return subtotal + tax;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Actividad no encontrada</h2>
        <Link to="/actividades" className="text-green-600 hover:text-green-700 font-semibold">
          Volver a actividades
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/actividades"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <IoArrowBack size={20} />
            Volver a actividades
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <img
                src={activity.featured_image || 'https://via.placeholder.com/1200x600?text=Actividad'}
                alt={activity.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x600?text=Imagen';
                }}
              />
            </div>

            {/* Gallery */}
            {activity.gallery_images && activity.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-6">
                {activity.gallery_images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=Img';
                    }}
                  />
                ))}
              </div>
            )}

            {/* Title & Meta */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {activity.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    {activity.category && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {activity.category.name}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[activity.difficulty_level]}`}>
                      {difficultyLabels[activity.difficulty_level]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <IoLocationOutline size={20} className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Ubicación</p>
                    <p className="font-medium text-gray-900">{activity.location}</p>
                  </div>
                </div>

                {activity.duration_text && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <IoTimeOutline size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Duración</p>
                      <p className="font-medium text-gray-900">{activity.duration_text}</p>
                    </div>
                  </div>
                )}

                {activity.min_age && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <IoPersonOutline size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Edad mínima</p>
                      <p className="font-medium text-gray-900">{activity.min_age} años</p>
                    </div>
                  </div>
                )}

                {activity.max_group_size && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <IoPersonOutline size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Grupo máximo</p>
                      <p className="font-medium text-gray-900">{activity.max_group_size} personas</p>
                    </div>
                  </div>
                )}
              </div>

              {activity.short_description && (
                <p className="text-lg text-gray-700 mt-4">
                  {activity.short_description}
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'description'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Descripción
                </button>
                <button
                  onClick={() => setActiveTab('included')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'included'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Incluye / No Incluye
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'requirements'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Requisitos
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                )}

                {activeTab === 'included' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Incluye */}
                    {activity.included && activity.included.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <IoCheckmarkCircle className="text-green-600" size={24} />
                          Incluye
                        </h3>
                        <ul className="space-y-2">
                          {activity.included.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <IoCheckmarkCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* No Incluye */}
                    {activity.not_included && activity.not_included.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <IoCloseCircle className="text-red-600" size={24} />
                          No Incluye
                        </h3>
                        <ul className="space-y-2">
                          {activity.not_included.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <IoCloseCircle className="text-red-600 flex-shrink-0 mt-1" size={18} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="space-y-6">
                    {/* Requisitos */}
                    {activity.requirements && activity.requirements.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <IoAlertCircle className="text-orange-600" size={24} />
                          Requisitos
                        </h3>
                        <ul className="space-y-2">
                          {activity.requirements.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="text-orange-600 flex-shrink-0 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recomendaciones */}
                    {activity.recommendations && activity.recommendations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <IoInformationCircle className="text-blue-600" size={24} />
                          Recomendaciones
                        </h3>
                        <ul className="space-y-2">
                          {activity.recommendations.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="text-blue-600 flex-shrink-0 mt-1">💡</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilidad */}
            {activity.available_days && activity.available_days.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Disponibilidad</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.available_days.map((day) => (
                    <span key={day} className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                      {daysTranslation[day]}
                    </span>
                  ))}
                </div>
                {activity.start_time && activity.end_time && (
                  <p className="text-gray-600 mt-3">
                    Horario: {activity.start_time} - {activity.end_time}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-green-600">
                    ${activity.price}
                  </span>
                  <span className="text-gray-600">/ persona</span>
                </div>
                {activity.rating > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IoStarOutline className="text-yellow-500" />
                    <span className="font-semibold">{activity.rating}</span>
                    <span>({activity.reviews_count} reseñas)</span>
                  </div>
                )}
              </div>

              {/* Date Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <IoCalendarOutline className="inline mr-1" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* People Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <IoPersonOutline className="inline mr-1" />
                  Número de personas
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <IoRemoveOutline size={20} />
                  </button>
                  <span className="flex-1 text-center font-semibold text-lg">
                    {numPeople}
                  </span>
                  <button
                    onClick={() => setNumPeople(numPeople + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <IoAddOutline size={20} />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${(parseFloat(activity.price) * numPeople).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IGV (18%)</span>
                  <span>${(parseFloat(activity.price) * numPeople * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
              >
                <IoCartOutline size={20} />
                Agregar al Carrito
              </button>

              <button
                className="w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <IoShareSocialOutline size={20} />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

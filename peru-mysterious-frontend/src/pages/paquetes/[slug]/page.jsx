// src/pages/paquetes/[slug]/page.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoPeopleOutline,
  IoHeartOutline,
  IoHeart,
  IoCartOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';

export default function PaqueteDetallePage() {
  const { slug } = useParams(); // ✅ Correcto para React Router
  const navigate = useNavigate();
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  useEffect(() => {
    loadPaquete();
  }, [slug]);

  const loadPaquete = async () => {
    try {
      setLoading(true);
      // TODO: Reemplazar con llamada real a API
      const mockPaquete = {
        id: 1,
        slug: slug,
        name: 'Tour Aventura en Cusco',
        description: 'Explora Machu Picchu, Valle Sagrado y más',
        price: 500,
        discount_price: 450,
        duration_days: 4,
        duration_nights: 3,
        difficulty_level: 'moderate',
        max_group_size: 15,
        featured_image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1',
        gallery: [
          'https://images.unsplash.com/photo-1587595431973-160d0d94add1',
          'https://images.unsplash.com/photo-1526392060635-9d6019884377',
        ],
        included: ['Transporte', 'Guía turístico', 'Entradas', 'Desayuno'],
        not_included: ['Almuerzo', 'Cena', 'Propinas'],
        itinerary: [
          { day: 1, title: 'Llegada a Cusco', description: 'City tour por Cusco' },
          { day: 2, title: 'Valle Sagrado', description: 'Visita a Pisac y Ollantaytambo' },
          { day: 3, title: 'Machu Picchu', description: 'Día completo en Machu Picchu' },
          { day: 4, title: 'Retorno', description: 'Regreso a Cusco' },
        ],
        category: { name: 'Aventura' },
        is_active: true,
      };

      setPaquete(mockPaquete);
    } catch (error) {
      console.error('Error cargando paquete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDate) {
      alert('Por favor selecciona una fecha');
      return;
    }

    // TODO: Integrar con tu sistema de carrito
    const cartItem = {
      tour_id: paquete.id,
      tour_name: paquete.name,
      price: paquete.discount_price || paquete.price,
      travel_date: selectedDate,
      number_of_people: numberOfPeople,
    };

    console.log('Agregando al carrito:', cartItem);
    alert(`Agregado al carrito:\n${paquete.name}\nFecha: ${selectedDate}\nPersonas: ${numberOfPeople}`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Guardar en backend
    console.log('Toggle favorito:', paquete.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  if (!paquete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour no encontrado</h2>
          <button
            onClick={() => navigate('/paquetes')}
            className="px-6 py-3 bg-pm-gold text-white rounded-lg hover:bg-pm-gold-dark"
          >
            Ver todos los tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Imagen Principal */}
          <div className="relative h-96">
            <img
              src={paquete.featured_image}
              alt={paquete.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={toggleFavorite}
                className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                {isFavorite ? (
                  <IoHeart className="text-red-500" size={24} />
                ) : (
                  <IoHeartOutline className="text-gray-600" size={24} />
                )}
              </button>
            </div>
            
            {paquete.discount_price && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                ¡OFERTA! {Math.round((1 - paquete.discount_price / paquete.price) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Info Principal */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-3">
                  {paquete.category.name}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {paquete.name}
                </h1>
                <p className="text-xl text-gray-600">{paquete.description}</p>
              </div>
              <div className="text-right">
                {paquete.discount_price ? (
                  <>
                    <p className="text-gray-500 line-through text-lg">
                      S/ {paquete.price}
                    </p>
                    <p className="text-4xl font-bold text-green-600">
                      S/ {paquete.discount_price}
                    </p>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-gray-900">
                    S/ {paquete.price}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">por persona</p>
              </div>
            </div>

            {/* Detalles Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <IoCalendarOutline className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="font-semibold">{paquete.duration_days}D / {paquete.duration_nights}N</p>
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
            {/* Incluido / No Incluido */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Itinerario */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Itinerario</h3>
              <div className="space-y-6">
                {paquete.itinerary.map((item) => (
                  <div key={item.day} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-pm-gold rounded-full flex items-center justify-center text-white font-bold">
                        {item.day}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Día {item.day}: {item.title}
                      </h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Galería */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Galería</h3>
              <div className="grid grid-cols-2 gap-4">
                {paquete.gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Imagen ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Formulario de Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Reserva Ahora</h3>

              {/* Selector de Fecha */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Viaje *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  required
                />
              </div>

              {/* Número de Personas */}
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
                <p className="text-xs text-gray-500 mt-1">
                  Máximo {paquete.max_group_size} personas por grupo
                </p>
              </div>

              {/* Resumen de Precio */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Precio por persona</span>
                  <span className="font-semibold">
                    S/ {paquete.discount_price || paquete.price}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Personas</span>
                  <span className="font-semibold">× {numberOfPeople}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-green-600">
                      S/ {((paquete.discount_price || paquete.price) * numberOfPeople).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <button
                onClick={handleAddToCart}
                className="w-full mb-3 py-4 bg-pm-gold hover:bg-pm-gold-dark text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <IoCartOutline size={24} />
                Agregar al Carrito
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
              >
                Reservar Ahora
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
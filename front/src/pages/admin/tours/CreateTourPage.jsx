// =============================================================
// ARCHIVO: src/pages/admin/tours/CreateTourPage.jsx (MEJORADO)
// =============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { IoArrowBack, IoSave, IoAdd, IoClose } from 'react-icons/io5';

// Lista de destinos disponibles
const DESTINOS = [
  { value: 'Cusco', label: 'Cusco' },
  { value: 'Arequipa', label: 'Arequipa' },
  { value: 'Puno', label: 'Puno' },
  { value: 'Ica', label: 'Ica' },
  { value: 'Huaraz', label: 'Huaraz' },
  { value: 'Manu', label: 'Manu' },
  { value: 'Lima', label: 'Lima' },
  { value: 'Trujillo', label: 'Trujillo' },
  { value: 'Piura', label: 'Piura' },
];

export default function CreateTourPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    duration_days: '',
    duration_nights: '',
    difficulty_level: 'moderate',
    max_group_size: '',
    location: 'Cusco', // ← Valor por defecto
    featured_image: '',
    is_featured: false,
    is_active: true,
    languages: ['Español', 'Inglés'],
    included: [''],
    not_included: [''],
    itinerary: [{ day: 1, title: '', description: '' }]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'itinerary' 
        ? { day: prev[field].length + 1, title: '', description: '' }
        : ''
      ]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtrar arrays vacíos
      const cleanData = {
        ...formData,
        included: formData.included.filter(i => i.trim()),
        not_included: formData.not_included.filter(i => i.trim()),
        itinerary: formData.itinerary.filter(i => i.title.trim() && i.description.trim()),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        duration_days: parseInt(formData.duration_days),
        duration_nights: parseInt(formData.duration_nights),
        max_group_size: parseInt(formData.max_group_size),
      };

      await api.post('/admin/tours', cleanData);
      alert('Tour creado exitosamente');
      navigate('/admin/tours');
    } catch (error) {
      console.error('Error creando tour:', error);
      alert(error.response?.data?.message || 'Error al crear el tour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/tours')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <IoArrowBack size={20} />
            Volver a Tours
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Tour</h1>
          <p className="text-gray-600 mt-1">Completa la información del tour</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Tour *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Ej: Camino Inca a Machu Picchu"
                />
              </div>

              {/* SELECTOR DE DESTINO - IMPORTANTE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destino/Ubicación *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                >
                  {DESTINOS.map((destino) => (
                    <option key={destino.value} value={destino.value}>
                      {destino.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  El tour aparecerá en la página del destino seleccionado
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="1">Aventura</option>
                  <option value="2">Cultural</option>
                  <option value="3">Naturaleza</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción Corta *
                </label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  required
                  rows="2"
                  maxLength="500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Descripción breve del tour (máx. 500 caracteres)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.short_description.length}/500 caracteres
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción Completa *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Descripción detallada del tour"
                />
              </div>
            </div>
          </div>

          {/* Precios y Duración */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Precios y Duración</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio Regular (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="450.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio con Descuento (USD)
                </label>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="399.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tamaño Máximo de Grupo *
                </label>
                <input
                  type="number"
                  name="max_group_size"
                  value={formData.max_group_size}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duración (Días) *
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duración (Noches) *
                </label>
                <input
                  type="number"
                  name="duration_nights"
                  value={formData.duration_nights}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nivel de Dificultad *
                </label>
                <select
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                >
                  <option value="easy">Fácil</option>
                  <option value="moderate">Moderado</option>
                  <option value="challenging">Desafiante</option>
                  <option value="difficult">Difícil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Incluye/No Incluye */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">¿Qué Incluye?</h2>
            
            <div className="space-y-2 mb-4">
              {formData.included.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('included', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Ej: Transporte turístico"
                  />
                  {formData.included.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('included', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <IoClose size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem('included')}
              className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 font-semibold"
            >
              <IoAdd size={20} />
              Agregar item
            </button>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">¿Qué NO Incluye?</h3>
            
            <div className="space-y-2 mb-4">
              {formData.not_included.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('not_included', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Ej: Vuelos internacionales"
                  />
                  {formData.not_included.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('not_included', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <IoClose size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem('not_included')}
              className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 font-semibold"
            >
              <IoAdd size={20} />
              Agregar item
            </button>
          </div>

          {/* Imagen */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Imagen Destacada</h2>
            <input
              type="url"
              name="featured_image"
              value={formData.featured_image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              placeholder="URL de la imagen (ej: https://example.com/image.jpg)"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recomendado: Imagen de 1200x800px en formato JPG o PNG
            </p>
          </div>

          {/* Opciones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
                />
                <span className="text-gray-700">Tour destacado (aparece en homepage)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
                />
                <span className="text-gray-700">Tour activo (visible para clientes)</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/tours')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <IoSave size={20} />
                  Crear Tour
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
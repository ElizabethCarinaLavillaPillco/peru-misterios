// =============================================================
// src/pages/admin/packages/CreatePackagePage.jsx
// =============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import { IoArrowBack, IoSave, IoAdd, IoClose, IoTrash } from 'react-icons/io5';

export default function CreatePackagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [availableTours, setAvailableTours] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    total_days: '',
    total_nights: '',
    difficulty_level: 'moderate',
    max_group_size: '',
    featured_image: '',
    is_featured: false,
    is_active: true,
    included: [''],
    not_included: [''],
    tours: []  // Array de { tour_id, day_number, order, notes }
  });

  useEffect(() => {
    loadTours();
    if (isEdit) {
      loadPackage();
    }
  }, [id]);

  const loadTours = async () => {
    try {
      const response = await api.get('/tours', { params: { per_page: 100 } });
      const toursData = response.data.data?.data || response.data.data || [];
      setAvailableTours(Array.isArray(toursData) ? toursData : []);
    } catch (error) {
      console.error('Error cargando tours:', error);
    }
  };

  const loadPackage = async () => {
    try {
      const response = await api.get(`/packages/${id}`);
      const pkg = response.data.data;
      
      // Convertir tours a formato del formulario
      const toursForForm = pkg.tours.map(tour => ({
        tour_id: tour.id,
        day_number: tour.pivot.day_number,
        order: tour.pivot.order,
        notes: tour.pivot.notes || ''
      }));

      setFormData({
        ...pkg,
        tours: toursForForm
      });
    } catch (error) {
      console.error('Error cargando paquete:', error);
      alert('Error al cargar el paquete');
    }
  };

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
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Agregar tour al paquete
  const addTourToPackage = () => {
    if (availableTours.length === 0) {
      alert('No hay tours disponibles');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tours: [...prev.tours, {
        tour_id: availableTours[0].id,
        day_number: 1,
        order: 0,
        notes: ''
      }]
    }));
  };

  // Actualizar tour en el paquete
  const updateTour = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      tours: prev.tours.map((tour, i) => 
        i === index ? { ...tour, [field]: value } : tour
      )
    }));
  };

  // Eliminar tour del paquete
  const removeTour = (index) => {
    setFormData(prev => ({
      ...prev,
      tours: prev.tours.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.tours.length === 0) {
        alert('Debes agregar al menos un tour al paquete');
        setLoading(false);
        return;
      }

      const cleanData = {
        ...formData,
        included: formData.included.filter(i => i.trim()),
        not_included: formData.not_included.filter(i => i.trim()),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        total_days: parseInt(formData.total_days),
        total_nights: parseInt(formData.total_nights),
        max_group_size: parseInt(formData.max_group_size),
        tours: formData.tours.map(t => ({
          tour_id: parseInt(t.tour_id),
          day_number: parseInt(t.day_number),
          order: parseInt(t.order) || 0,
          notes: t.notes || null
        }))
      };

      if (isEdit) {
        await api.put(`/admin/packages/${id}`, cleanData);
        alert('Paquete actualizado exitosamente');
      } else {
        await api.post('/admin/packages', cleanData);
        alert('Paquete creado exitosamente');
      }
      
      navigate('/admin/packages');
    } catch (error) {
      console.error('Error guardando paquete:', error);
      alert(error.response?.data?.message || 'Error al guardar el paquete');
    } finally {
      setLoading(false);
    }
  };

  // Agrupar tours por día para mostrarlos mejor
  const toursByDay = formData.tours.reduce((acc, tour, index) => {
    const day = tour.day_number;
    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...tour, index });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/packages')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <IoArrowBack size={20} />
            Volver a Paquetes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Paquete' : 'Crear Nuevo Paquete'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Actualiza la información del paquete' : 'Completa la información del paquete'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Paquete *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Ej: Tour Completo por el Sur del Perú"
                />
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
                  placeholder="Descripción breve del paquete (máx. 500 caracteres)"
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
                  placeholder="Descripción detallada del paquete"
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
                  placeholder="1500.00"
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
                  placeholder="1350.00"
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
                  Duración Total (Días) *
                </label>
                <input
                  type="number"
                  name="total_days"
                  value={formData.total_days}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="7"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duración Total (Noches) *
                </label>
                <input
                  type="number"
                  name="total_nights"
                  value={formData.total_nights}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="6"
                />
              </div>
            </div>
          </div>
{/* TOURS DEL PAQUETE - LA PARTE MÁS IMPORTANTE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Tours del Paquete *</h2>
              <button
                type="button"
                onClick={addTourToPackage}
                className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 font-semibold"
              >
                <IoAdd size={20} />
                Agregar Tour
              </button>
            </div>

            {formData.tours.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600 mb-4">No hay tours agregados al paquete</p>
                <button
                  type="button"
                  onClick={addTourToPackage}
                  className="px-6 py-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold/90 font-semibold"
                >
                  Agregar Primer Tour
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Mostrar tours agrupados por día */}
                {Object.keys(toursByDay).sort((a, b) => a - b).map((day) => (
                  <div key={day} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      📅 Día {day}
                    </h3>
                    
                    <div className="space-y-4">
                      {toursByDay[day].map((tour) => {
                        const selectedTour = availableTours.find(t => t.id == tour.tour_id);
                        
                        return (
                          <div key={tour.index} className="bg-white border border-gray-300 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                              {/* Tour Selection */}
                              <div className="md:col-span-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Tour *
                                </label>
                                <select
                                  value={tour.tour_id}
                                  onChange={(e) => updateTour(tour.index, 'tour_id', e.target.value)}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                                >
                                  {availableTours.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      {t.name} ({t.duration_days}D/{t.duration_nights}N)
                                    </option>
                                  ))}
                                </select>
                                {selectedTour && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    📍 {selectedTour.location} | 💵 ${selectedTour.price}
                                  </p>
                                )}
                              </div>

                              {/* Day Number */}
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Día *
                                </label>
                                <input
                                  type="number"
                                  value={tour.day_number}
                                  onChange={(e) => updateTour(tour.index, 'day_number', parseInt(e.target.value))}
                                  required
                                  min="1"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                                />
                              </div>

                              {/* Order */}
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Orden
                                </label>
                                <input
                                  type="number"
                                  value={tour.order}
                                  onChange={(e) => updateTour(tour.index, 'order', parseInt(e.target.value))}
                                  min="0"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                                />
                              </div>

                              {/* Delete Button */}
                              <div className="md:col-span-3 flex items-end">
                                <button
                                  type="button"
                                  onClick={() => removeTour(tour.index)}
                                  className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold flex items-center justify-center gap-2"
                                >
                                  <IoTrash size={18} />
                                  Eliminar
                                </button>
                              </div>

                              {/* Notes */}
                              <div className="md:col-span-12">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Notas Especiales (opcional)
                                </label>
                                <textarea
                                  value={tour.notes}
                                  onChange={(e) => updateTour(tour.index, 'notes', e.target.value)}
                                  rows="2"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                                  placeholder="Ej: Traer ropa abrigada, salida temprano a las 5am"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Los tours se mostrarán en el itinerario agrupados por día y ordenados según el número de orden.
              </p>
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                    placeholder="Ej: Todos los transportes terrestres"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              placeholder="URL de la imagen"
            />
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
                <span className="text-gray-700">Paquete destacado (aparece en homepage)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
                />
                <span className="text-gray-700">Paquete activo (visible para clientes)</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
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
                  {isEdit ? 'Actualizar Paquete' : 'Crear Paquete'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
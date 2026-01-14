// src/pages/admin/activities/CreateActivityPage.jsx
import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoSaveOutline,
  IoArrowBackOutline,
  IoAddCircleOutline,
  IoCloseCircle,
} from 'react-icons/io5';

export default function CreateActivityPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    short_description: '',
    description: '',
    featured_image: '',
    gallery_images: [],
    location: '',
    price: '',
    duration_hours: '',
    duration_text: '',
    difficulty_level: 'moderate',
    min_age: '',
    max_group_size: '',
    included: [],
    not_included: [],
    requirements: [],
    recommendations: [],
    available_days: [],
    start_time: '',
    end_time: '',
    is_featured: false,
    is_active: true,
  });

  // Estados para inputs temporales
  const [galleryInput, setGalleryInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [notIncludedInput, setNotIncludedInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [recommendationInput, setRecommendationInput] = useState('');

  const daysOfWeek = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' },
  ];

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadActivity();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadActivity = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/activities/${id}`);
      const activity = response.data.data || response.data;

      setFormData({
        title: activity.title || '',
        category_id: activity.category_id || '',
        short_description: activity.short_description || '',
        description: activity.description || '',
        featured_image: activity.featured_image || '',
        gallery_images: activity.gallery_images || [],
        location: activity.location || '',
        price: activity.price || '',
        duration_hours: activity.duration_hours || '',
        duration_text: activity.duration_text || '',
        difficulty_level: activity.difficulty_level || 'moderate',
        min_age: activity.min_age || '',
        max_group_size: activity.max_group_size || '',
        included: activity.included || [],
        not_included: activity.not_included || [],
        requirements: activity.requirements || [],
        recommendations: activity.recommendations || [],
        available_days: activity.available_days || [],
        start_time: activity.start_time || '',
        end_time: activity.end_time || '',
        is_featured: activity.is_featured || false,
        is_active: activity.is_active !== undefined ? activity.is_active : true,
      });
    } catch (error) {
      console.error('Error al cargar actividad:', error);
      alert('Error al cargar la actividad');
      navigate('/admin/activities');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  // Funciones para agregar/quitar items de arrays
  const addToArray = (arrayName, value, setInput) => {
    if (value.trim() && !formData[arrayName].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [arrayName]: [...prev[arrayName], value.trim()],
      }));
      setInput('');
    }
  };

  const removeFromArray = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!formData.description.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    if (!formData.location.trim()) {
      alert('La ubicación es obligatoria');
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      alert('El precio debe ser un valor válido');
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...formData,
        category_id: formData.category_id || null,
        price: parseFloat(formData.price),
        duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
        min_age: formData.min_age ? parseInt(formData.min_age) : null,
        max_group_size: formData.max_group_size ? parseInt(formData.max_group_size) : null,
      };

      if (isEditing) {
        await api.put(`/admin/activities/${id}`, dataToSend);
        alert('Actividad actualizada exitosamente');
      } else {
        await api.post('/admin/activities', dataToSend);
        alert('Actividad creada exitosamente');
      }

      navigate('/admin/activities');
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      alert(error.response?.data?.message || 'Error al guardar la actividad');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/activities')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <IoArrowBackOutline size={20} />
          Volver a Actividades
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Editar Actividad' : 'Crear Nueva Actividad'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing
            ? 'Actualiza la información de la actividad'
            : 'Completa la información para crear una nueva actividad'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>

          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={255}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Título de la actividad"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Ej: Cusco, Perú"
                />
              </div>
            </div>

            {/* Descripción corta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Corta
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                rows={2}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Breve descripción (máximo 500 caracteres)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.short_description.length}/500 caracteres
              </p>
            </div>

            {/* Descripción completa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Completa <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Descripción detallada de la actividad"
              />
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Imágenes</h2>

          <div className="space-y-4">
            {/* Imagen destacada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Destacada (URL)
              </label>
              <input
                type="url"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {formData.featured_image && (
                <div className="mt-2">
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Galería de imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Galería de Imágenes
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('gallery_images', galleryInput, setGalleryInput))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="URL de la imagen"
                />
                <button
                  type="button"
                  onClick={() => addToArray('gallery_images', galleryInput, setGalleryInput)}
                  className="px-4 py-2 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  <IoAddCircleOutline size={20} />
                </button>
              </div>

              {formData.gallery_images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.gallery_images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x150?text=Error';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromArray('gallery_images', idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IoCloseCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detalles de la Actividad */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles de la Actividad</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (USD) <span className="text-red-500">*</span>
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
                placeholder="0.00"
              />
            </div>

            {/* Dificultad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Dificultad <span className="text-red-500">*</span>
              </label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              >
                <option value="easy">Fácil</option>
                <option value="moderate">Moderado</option>
                <option value="challenging">Desafiante</option>
                <option value="difficult">Difícil</option>
              </select>
            </div>

            {/* Duración en horas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (horas)
              </label>
              <input
                type="number"
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: 4"
              />
            </div>

            {/* Duración texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (texto)
              </label>
              <input
                type="text"
                name="duration_text"
                value={formData.duration_text}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: Medio día, 2-3 horas"
              />
            </div>

            {/* Edad mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad Mínima
              </label>
              <input
                type="number"
                name="min_age"
                value={formData.min_age}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: 12"
              />
            </div>

            {/* Tamaño máximo del grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño Máximo del Grupo
              </label>
              <input
                type="number"
                name="max_group_size"
                value={formData.max_group_size}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: 15"
              />
            </div>

            {/* Hora de inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Inicio
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
            </div>

            {/* Hora de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Fin
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Días Disponibles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Días Disponibles</h2>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.available_days.includes(day.value)
                    ? 'bg-pm-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Qué Incluye */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Qué Incluye</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agregar Item Incluido
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={includedInput}
                  onChange={(e) => setIncludedInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('included', includedInput, setIncludedInput))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Ej: Transporte"
                />
                <button
                  type="button"
                  onClick={() => addToArray('included', includedInput, setIncludedInput)}
                  className="px-4 py-2 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  <IoAddCircleOutline size={20} />
                </button>
              </div>

              {formData.included.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {formData.included.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-lg">
                      <span className="text-green-800">✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('included', idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <IoCloseCircle size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agregar Item NO Incluido
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={notIncludedInput}
                  onChange={(e) => setNotIncludedInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('not_included', notIncludedInput, setNotIncludedInput))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Ej: Comidas"
                />
                <button
                  type="button"
                  onClick={() => addToArray('not_included', notIncludedInput, setNotIncludedInput)}
                  className="px-4 py-2 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  <IoAddCircleOutline size={20} />
                </button>
              </div>

              {formData.not_included.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {formData.not_included.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-red-50 px-4 py-2 rounded-lg">
                      <span className="text-red-800">✗ {item}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('not_included', idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <IoCloseCircle size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Requisitos y Recomendaciones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Requisitos y Recomendaciones</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agregar Requisito
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('requirements', requirementInput, setRequirementInput))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Ej: Buen estado físico"
                />
                <button
                  type="button"
                  onClick={() => addToArray('requirements', requirementInput, setRequirementInput)}
                  className="px-4 py-2 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  <IoAddCircleOutline size={20} />
                </button>
              </div>

              {formData.requirements.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {formData.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-yellow-50 px-4 py-2 rounded-lg">
                      <span className="text-yellow-800">• {item}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('requirements', idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <IoCloseCircle size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agregar Recomendación
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={recommendationInput}
                  onChange={(e) => setRecommendationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('recommendations', recommendationInput, setRecommendationInput))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Ej: Llevar protector solar"
                />
                <button
                  type="button"
                  onClick={() => addToArray('recommendations', recommendationInput, setRecommendationInput)}
                  className="px-4 py-2 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  <IoAddCircleOutline size={20} />
                </button>
              </div>

              {formData.recommendations.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {formData.recommendations.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                      <span className="text-blue-800">💡 {item}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('recommendations', idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <IoCloseCircle size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
              />
              <span className="text-sm font-medium text-gray-700">
                Marcar como actividad destacada
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
              />
              <span className="text-sm font-medium text-gray-700">
                Actividad activa (visible para el público)
              </span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/activities')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <IoSaveOutline size={20} />
                {isEditing ? 'Actualizar Actividad' : 'Crear Actividad'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// src/pages/admin/tours/CreateTourPage.jsx
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

export default function CreateTourPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    short_description: '',
    description: '',
    featured_image: '',
    gallery_images: [],
    location: '',
    price: '',
    discount_price: '',
    duration_days: '',
    duration_nights: '',
    difficulty_level: 'moderate',
    max_group_size: '',
    included: [],
    not_included: [],
    itinerary: [],
    requirements: [],
    is_featured: false,
    is_active: true,
  });

  // Estados para inputs temporales
  const [galleryInput, setGalleryInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [notIncludedInput, setNotIncludedInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadTour();
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

	// Cambiar solo la función loadTour:

	const loadTour = async () => {
		try {
		setLoading(true);
		// Usar la ruta de admin en lugar de la pública
		const response = await api.get(`/admin/tours/${id}`);
		const tour = response.data.data || response.data;

		// Llenar el formulario con los datos del tour
		setFormData({
			name: tour.name || '',
			slug: tour.slug || '',
			category_id: tour.category_id || '',
			short_description: tour.short_description || '',
			description: tour.description || '',
			featured_image: tour.featured_image || '',
			gallery_images: Array.isArray(tour.gallery_images) ? tour.gallery_images : [],
			location: tour.location || '',
			price: tour.price || '',
			discount_price: tour.discount_price || '',
			duration_days: tour.duration_days || '',
			duration_nights: tour.duration_nights || '',
			difficulty_level: tour.difficulty_level || 'moderate',
			max_group_size: tour.max_group_size || '',
			included: Array.isArray(tour.included) ? tour.included : [],
			not_included: Array.isArray(tour.not_included) ? tour.not_included : [],
			itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
			requirements: Array.isArray(tour.requirements) ? tour.requirements : [],
			is_featured: tour.is_featured || false,
			is_active: tour.is_active !== undefined ? tour.is_active : true,
		});
		} catch (error) {
		console.error('Error al cargar tour:', error);
		alert('Error al cargar el tour');
		navigate('/admin/tours');
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

    // Validaciones básicas
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
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

    if (!formData.duration_days || parseInt(formData.duration_days) < 1) {
      alert('La duración debe ser al menos 1 día');
      return;
    }

    if (!formData.max_group_size || parseInt(formData.max_group_size) < 1) {
      alert('El tamaño del grupo debe ser al menos 1 persona');
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...formData,
        category_id: formData.category_id || null,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        duration_days: parseInt(formData.duration_days),
        duration_nights: parseInt(formData.duration_nights || 0),
        max_group_size: parseInt(formData.max_group_size),
      };

      if (isEditing) {
        await api.put(`/admin/tours/${id}`, dataToSend);
        alert('Tour actualizado exitosamente');
      } else {
        await api.post('/admin/tours', dataToSend);
        alert('Tour creado exitosamente');
      }

      navigate('/admin/tours');
    } catch (error) {
      console.error('Error al guardar tour:', error);
      alert(error.response?.data?.message || 'Error al guardar el tour');
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
          onClick={() => navigate('/admin/tours')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <IoArrowBackOutline size={20} />
          Volver a Tours
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Editar Tour' : 'Crear Nuevo Tour'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing
            ? 'Actualiza la información del tour'
            : 'Completa la información para crear un nuevo tour'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>

          <div className="space-y-4">
            {/* Nombre del Tour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Tour <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: Tour Machu Picchu 2D/1N"
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
                placeholder="Breve descripción del tour (máximo 500 caracteres)"
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
                placeholder="Descripción detallada del tour"
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

        {/* Detalles del Tour */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles del Tour</h2>

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

            {/* Precio con descuento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                placeholder="0.00"
              />
            </div>

            {/* Duración días */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (Días) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: 2"
              />
            </div>

            {/* Duración noches */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (Noches) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration_nights"
                value={formData.duration_nights}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: 1"
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

            {/* Tamaño máximo del grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño Máximo del Grupo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max_group_size"
                value={formData.max_group_size}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: 15"
              />
            </div>
          </div>
        </div>

        {/* Qué Incluye / No Incluye */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Qué Incluye / No Incluye</h2>

          <div className="space-y-4">
            {/* Incluye */}
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

            {/* No Incluye */}
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

        {/* Requisitos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Requisitos</h2>

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
                Marcar como tour destacado
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
                Tour activo (visible para el público)
              </span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/tours')}
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
                {isEditing ? 'Actualizar Tour' : 'Crear Tour'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

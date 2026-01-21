// src/pages/admin/destinations/CreateDestinationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoSaveOutline,
  IoArrowBackOutline,
  IoAddCircleOutline,
  IoCloseCircle,
} from 'react-icons/io5';

export default function CreateDestinationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    featured_image: '',
    gallery: [],
    is_active: true,
    order: 0,
  });

  const [galleryInput, setGalleryInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadDestination();
    }
  }, [id]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/destinations/${id}`);
      const dest = response.data.data || response.data;

      setFormData({
        name: dest.name || '',
        slug: dest.slug || '',
        short_description: dest.short_description || '',
        description: dest.description || '',
        featured_image: dest.featured_image || '',
        gallery: Array.isArray(dest.gallery) ? dest.gallery : [],
        is_active: dest.is_active !== undefined ? dest.is_active : true,
        order: dest.order || 0,
      });
    } catch (error) {
      console.error('Error al cargar destino:', error);
      alert('Error al cargar el destino');
      navigate('/admin/destinations');
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

  const addToGallery = () => {
    if (galleryInput.trim() && !formData.gallery.includes(galleryInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, galleryInput.trim()],
      }));
      setGalleryInput('');
    }
  };

  const removeFromGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...formData,
        order: parseInt(formData.order) || 0,
      };

      if (isEditing) {
        await api.put(`/admin/destinations/${id}`, dataToSend);
        alert('Destino actualizado exitosamente');
      } else {
        await api.post('/admin/destinations', dataToSend);
        alert('Destino creado exitosamente');
      }

      navigate('/admin/destinations');
    } catch (error) {
      console.error('Error al guardar destino:', error);
      alert(error.response?.data?.message || 'Error al guardar el destino');
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
          onClick={() => navigate('/admin/destinations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <IoArrowBackOutline size={20} />
          Volver a Destinos
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Editar Destino' : 'Crear Nuevo Destino'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing
            ? 'Actualiza la información del destino'
            : 'Completa la información para crear un nuevo destino'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información Básica
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Destino <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Ej: Cusco"
              />
            </div>

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
                placeholder="Breve descripción del destino (máximo 500 caracteres)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.short_description.length}/500 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Completa
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Descripción detallada del destino"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden de visualización
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Menor número aparece primero
              </p>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Imágenes</h2>

          <div className="space-y-4">
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
                      e.target.src =
                        'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Galería de Imágenes
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addToGallery())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="URL de la imagen"
                />
                <button
                  type="button"
                  onClick={addToGallery}
                  className="px-4 py-2 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  <IoAddCircleOutline size={20} />
                </button>
              </div>

              {formData.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.gallery.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/200x150?text=Error';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromGallery(idx)}
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

        {/* Opciones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
            />
            <span className="text-sm font-medium text-gray-700">
              Destino activo (visible para el público)
            </span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/destinations')}
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
                {isEditing ? 'Actualizar Destino' : 'Crear Destino'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
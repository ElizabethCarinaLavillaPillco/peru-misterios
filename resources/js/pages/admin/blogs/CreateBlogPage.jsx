// src/pages/admin/blogs/CreateBlogPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoSaveOutline,
  IoArrowBackOutline,
  IoCloudUploadOutline,
  IoAddCircleOutline,
  IoCloseCircle,
} from 'react-icons/io5';

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    excerpt: '',
    content: '',
    featured_image: '',
    is_published: false,
    tags: [],
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadBlog();
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

  const loadBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/blogs/${id}`);
      const blog = response.data.data || response.data;

      setFormData({
        title: blog.title || '',
        category_id: blog.category_id || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        featured_image: blog.featured_image || '',
        is_published: blog.is_published || false,
        tags: blog.tags || [],
      });
    } catch (error) {
      console.error('Error al cargar blog:', error);
      alert('Error al cargar el blog');
      navigate('/admin/blogs');
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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!formData.content.trim()) {
      alert('El contenido es obligatorio');
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...formData,
        category_id: formData.category_id || null,
      };

      if (isEditing) {
        await api.put(`/admin/blogs/${id}`, dataToSend);
        alert('Blog actualizado exitosamente');
      } else {
        await api.post('/admin/blogs', dataToSend);
        alert('Blog creado exitosamente');
      }

      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error al guardar blog:', error);
      alert(error.response?.data?.message || 'Error al guardar el blog');
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
          onClick={() => navigate('/admin/blogs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <IoArrowBackOutline size={20} />
          Volver a Blogs
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Editar Blog' : 'Crear Nuevo Blog'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing
            ? 'Actualiza la información del blog'
            : 'Completa la información para crear un nuevo blog'}
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
                placeholder="Título del blog"
              />
            </div>

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

            {/* Extracto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracto (Resumen corto)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Breve descripción del blog (máximo 500 caracteres)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length}/500 caracteres
              </p>
            </div>

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
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contenido</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido del Blog <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent font-mono text-sm"
              placeholder="Escribe el contenido del blog aquí..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar Markdown para dar formato al contenido
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Etiquetas (Tags)</h2>

          <div className="space-y-4">
            {/* Add Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                placeholder="Escribe una etiqueta y presiona Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <IoAddCircleOutline size={20} />
                Agregar
              </button>
            </div>

            {/* Tags List */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <IoCloseCircle size={18} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Opciones de Publicación */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones de Publicación</h2>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="w-5 h-5 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
              />
              <span className="text-sm font-medium text-gray-700">
                Publicar blog inmediatamente
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-8">
              Si no está marcado, el blog se guardará como borrador
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
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
                {isEditing ? 'Actualizar Blog' : 'Crear Blog'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

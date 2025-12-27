// src/pages/admin/blogs/AdminBlogsListPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoAddCircleOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
} from 'react-icons/io5';

export default function AdminBlogsListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadBlogs();
    loadStats();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/blogs');
      setBlogs(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al cargar blogs:', error);
      alert('Error al cargar los blogs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/blogs/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este blog?')) return;

    try {
      await api.delete(`/admin/blogs/${id}`);
      alert('Blog eliminado exitosamente');
      loadBlogs();
      loadStats();
    } catch (error) {
      console.error('Error al eliminar blog:', error);
      alert('Error al eliminar el blog');
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && blog.is_published) ||
      (filterStatus === 'draft' && !blog.is_published);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Blogs</h1>
            <p className="text-gray-600 mt-1">Administra todos los artículos del blog</p>
          </div>
          <Link
            to="/admin/blogs/create"
            className="flex items-center gap-2 px-6 py-3 bg-pm-gold hover:bg-yellow-600 text-white rounded-lg transition-colors font-semibold"
          >
            <IoAddCircleOutline size={20} />
            Crear Nuevo Blog
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Blogs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_blogs}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <IoEyeOutline className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Publicados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <IoCheckmarkCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Borradores</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <IoCreateOutline className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Vistas</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.total_views}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <IoEyeOutline className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No se encontraron blogs</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={blog.featured_image || 'https://via.placeholder.com/200x150?text=Blog'}
                      alt={blog.title}
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {blog.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div>
                        {blog.is_published ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-300">
                            <IoCheckmarkCircle size={16} />
                            Publicado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-300">
                            <IoCreateOutline size={16} />
                            Borrador
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <IoPersonOutline size={16} />
                        {blog.author?.name || 'Autor'}
                      </span>
                      <span className="flex items-center gap-1">
                        <IoCalendarOutline size={16} />
                        {formatDate(blog.published_at || blog.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <IoEyeOutline size={16} />
                        {blog.views} vistas
                      </span>
                      {blog.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {blog.category.name}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <IoEyeOutline size={16} />
                        Ver
                      </a>
                      <Link
                        to={`/admin/blogs/${blog.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <IoCreateOutline size={16} />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <IoTrashOutline size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

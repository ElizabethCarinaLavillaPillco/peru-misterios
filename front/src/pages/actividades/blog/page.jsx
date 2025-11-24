// src/pages/actividades/blog/page.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoTimeOutline,
  IoPersonOutline,
  IoEyeOutline,
  IoSearchOutline,
  IoArrowForward
} from 'react-icons/io5';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadBlogs();
    loadCategories();
  }, [selectedCategory]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) {
        params.category_id = selectedCategory;
      }

      const response = await api.get('/blogs', { params });
      const blogsData = response.data.data?.data || response.data.data || response.data || [];
      setPosts(Array.isArray(blogsData) ? blogsData : []);
    } catch (error) {
      console.error('Error al cargar blogs:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog de Viajes
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Guías, consejos y experiencias para tu próxima aventura
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <IoSearchOutline
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <IoPersonOutline size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm || selectedCategory ? 'No se encontraron artículos' : 'Próximamente artículos'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || selectedCategory
                ? 'Intenta con otros términos de búsqueda o filtros'
                : 'Nuestro equipo está escribiendo increíbles artículos de viaje. ¡Vuelve pronto!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.featured_image || 'https://via.placeholder.com/400x300?text=Blog+Post'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Post';
                    }}
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                        {post.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <IoPersonOutline size={16} />
                      {post.author?.name || 'Admin'}
                    </span>
                    <span className="flex items-center gap-1">
                      <IoTimeOutline size={16} />
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateText(post.excerpt, 120)}
                    </p>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <IoEyeOutline size={16} />
                      {post.views || 0} vistas
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm group-hover:gap-3 transition-all"
                    >
                      Leer más
                      <IoArrowForward size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

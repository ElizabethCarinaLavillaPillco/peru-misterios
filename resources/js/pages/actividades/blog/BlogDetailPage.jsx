import React from 'react';

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import {
  IoTimeOutline,
  IoPersonOutline,
  IoEyeOutline,
  IoArrowBack,
  IoShareSocialOutline,
} from 'react-icons/io5';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${slug}`);
      const postData = response.data.data || response.data;
      setPost(postData);

      // Cargar posts relacionados de la misma categoría
      if (postData.category_id) {
        loadRelatedPosts(postData.category_id, postData.id);
      }
    } catch (error) {
      console.error('Error al cargar blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (categoryId, currentPostId) => {
    try {
      const response = await api.get('/blogs', {
        params: { category_id: categoryId }
      });
      const posts = response.data.data?.data || response.data.data || [];
      // Filtrar el post actual y limitar a 3
      const filtered = posts.filter(p => p.id !== currentPostId).slice(0, 3);
      setRelatedPosts(filtered);
    } catch (error) {
      console.error('Error al cargar posts relacionados:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog no encontrado</h2>
        <Link to="/blog" className="text-purple-600 hover:text-purple-700 font-semibold">
          Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <IoArrowBack size={20} />
            Volver al blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                {post.category.name}
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <IoPersonOutline size={20} />
              <span className="font-medium">{post.author?.name || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <IoTimeOutline size={20} />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <IoEyeOutline size={20} />
              <span>{post.views || 0} vistas</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 ml-auto text-purple-600 hover:text-purple-700 font-semibold"
            >
              <IoShareSocialOutline size={20} />
              Compartir
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x600?text=Blog+Image';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedPost.featured_image || 'https://via.placeholder.com/400x300'}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(relatedPost.published_at || relatedPost.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

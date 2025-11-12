
// =============================================================
// ARCHIVO: src/pages/actividades/blog/page.jsx
// =============================================================

import { IoTimeOutline, IoPersonOutline } from 'react-icons/io5';

export default function BlogPage() {
  const posts = []; // Vacío hasta que admin cree

  return (
    <div className="min-h-screen bg-gray-50">
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
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <IoPersonOutline size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Próximamente artículos
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Nuestro equipo está escribiendo increíbles artículos de viaje. ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Aquí irán los posts */}
          </div>
        )}
      </div>
    </div>
  );
}
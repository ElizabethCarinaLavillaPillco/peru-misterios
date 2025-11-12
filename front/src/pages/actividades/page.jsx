
// =============================================================
// ARCHIVO: src/pages/actividades/page.jsx
// =============================================================

import { Link } from 'react-router-dom';
import { IoCompassOutline, IoNewspaperOutline } from 'react-icons/io5';

export default function ActividadesPage() {
  const actividades = []; // Vacío hasta que admin cree

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Actividades y Experiencias
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Vive aventuras inolvidables en el Perú
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Link al Blog */}
        <div className="mb-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <IoNewspaperOutline size={32} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Visita nuestro Blog</h3>
              <p className="text-gray-600">Guías, consejos y experiencias de viaje</p>
            </div>
          </Link>
        </div>

        {actividades.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <IoCompassOutline size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Próximamente
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Estamos preparando increíbles actividades para ti. ¡Mantente atento!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aquí irán las actividades */}
          </div>
        )}
      </div>
    </div>
  );
}


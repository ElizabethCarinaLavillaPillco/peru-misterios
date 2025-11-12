
// =============================================================
// ARCHIVO: src/pages/hoteles/page.jsx
// =============================================================

import { Link } from 'react-router-dom';
import { IoLocationSharp, IoBedOutline } from 'react-icons/io5';

const ciudadesHoteles = [
  { 
    id: 'cusco', 
    name: 'Cusco', 
    hoteles: 0,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    descripcion: 'Hoteles cerca de Machu Picchu'
  },
  { 
    id: 'lima', 
    name: 'Lima', 
    hoteles: 0,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    descripcion: 'Hoteles en la capital'
  },
];

export default function HotelesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hoteles Recomendados
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Encuentra el hospedaje perfecto para tu aventura
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ciudadesHoteles.map((ciudad) => (
            <Link
              key={ciudad.id}
              to={`/hoteles/${ciudad.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={ciudad.image}
                  alt={ciudad.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {ciudad.name}
                  </h3>
                  <p className="text-white/80 mb-3">{ciudad.descripcion}</p>
                  <div className="flex items-center gap-2 text-white/80">
                    <IoBedOutline size={18} />
                    <span className="text-sm">{ciudad.hoteles} hoteles disponibles</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// src/pages/packages/PackagesListPage.jsx - PÁGINA PÚBLICA
// =============================================================
import React from 'react';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { packageAPI } from "@/lib/api";
import { IoCalendarOutline, IoPeopleOutline, IoStar } from "react-icons/io5";

export default function PackagesListPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await packageAPI.getAll();
      const packagesData = response.data || response || [];
      setPackages(Array.isArray(packagesData) ? packagesData : []);
    } catch (error) {
      console.error('Error:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pm-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Paquetes Turísticos</h1>
          <p className="text-xl text-white/90">
            Descubre nuestros paquetes completos con múltiples destinos
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No hay paquetes disponibles
            </h3>
            <p className="text-gray-600">
              Próximamente tendremos paquetes increíbles para ti
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-700 text-lg">
                {packages.length} paquete{packages.length !== 1 ? 's' : ''} disponible{packages.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  pkgData={pkg}
                  onClick={() => navigate(`/packages/${pkg.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PackageCard({ pkgData, onClick }) {
  const pkg = pkgData;
  const finalPrice = pkg.discount_price || pkg.price;
  const hasDiscount = pkg.discount_price && pkg.discount_price < pkg.price;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
    >
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.featured_image || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800'}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {Math.round(((pkg.price - pkg.discount_price) / pkg.price) * 100)}% OFF
          </div>
        )}

        {pkg.is_featured && (
          <div className="absolute top-3 right-3 bg-pm-gold text-black px-3 py-1 rounded-full text-sm font-bold">
            ⭐ Destacado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        {pkg.category?.name && (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
            {pkg.category.name}
          </span>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pm-gold transition-colors">
          {pkg.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {pkg.short_description || pkg.description}
        </p>

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
          <div className="flex items-center gap-1">
            <IoCalendarOutline />
            <span>{pkg.total_days}D/{pkg.total_nights}N</span>
          </div>
          {pkg.tours && pkg.tours.length > 0 && (
            <div className="flex items-center gap-1">
              🎯 <span>{pkg.tours.length} tours</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <IoPeopleOutline />
            <span>Max {pkg.max_group_size}</span>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through text-sm block">
                  ${pkg.price}
                </span>
                <p className="text-2xl font-bold text-pm-gold">
                  ${finalPrice}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                ${finalPrice}
              </p>
            )}
            <span className="text-xs text-gray-500">por persona</span>
          </div>

          <button className="px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}

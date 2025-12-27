import { useState } from 'react';

export default function RewardsSection() {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Programa de Recompensas</h3>
          <p className="text-yellow-100 mb-4">
            Acumula puntos y obtén descuentos exclusivos
          </p>
          <button className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-yellow-50 transition">
            Ver Beneficios
          </button>
        </div>
        <div className="text-6xl">🎁</div>
      </div>
    </div>
  );
}
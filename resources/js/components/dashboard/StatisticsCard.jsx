import React from 'react';

import { useState } from 'react';


export default function StatisticsCard({ bookingsCount = 0 }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Estadísticas
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Reservas</span>
          <span className="text-2xl font-bold text-blue-600">{bookingsCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Países Visitados</span>
          <span className="text-2xl font-bold text-purple-600">1</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Puntos Acumulados</span>
          <span className="text-2xl font-bold text-green-600">0</span>
        </div>
      </div>
    </div>
  );
}
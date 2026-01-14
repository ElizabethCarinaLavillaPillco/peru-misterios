import React from 'react';
import { useState } from 'react';

export default function PreferencesCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Preferencias
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Notificaciones Email</span>
          <button className="w-12 h-6 bg-blue-600 rounded-full relative">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Ofertas Especiales</span>
          <button className="w-12 h-6 bg-gray-300 rounded-full relative">
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Newsletter</span>
          <button className="w-12 h-6 bg-blue-600 rounded-full relative">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
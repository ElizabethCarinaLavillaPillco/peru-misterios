import { Link } from "react-router-dom";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function UserProfileCard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Avatar */}
      <div className="text-center mb-4">
        <div className="relative inline-block">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.phone && (
          <p className="text-sm text-gray-500">{user.phone}</p>
        )}
        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
          {user.role}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">0</p>
          <p className="text-xs text-gray-500">Viajes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">0</p>
          <p className="text-xs text-gray-500">Puntos</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Link 
          href="/mi-cuenta/editar-perfil"
          className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
        >
          Editar Perfil
        </Link>
        <Link
          href="/mi-cuenta/configuracion"
          className="block w-full py-2 px-4 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition"
        >
          Configuración
        </Link>
      </div>
    </div>
  );
}
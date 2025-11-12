import { Link } from "react-router-dom";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function WelcomeBanner({ userName }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-3xl font-bold mb-2">
        {getGreeting()}, {userName}! 👋
      </h2>
      <p className="text-blue-100 mb-6">
        ¿Listo para tu próxima aventura en Perú?
      </p>
      <div className="flex flex-wrap gap-4">
        <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
          Explorar Tours
        </button>
        <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition">
          Mis Reservas
        </button>
      </div>
    </div>
  );
}
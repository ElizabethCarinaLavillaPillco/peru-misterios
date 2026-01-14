import React from 'react';

import { IoLocationSharp } from 'react-icons/io5';

function FinalCta() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6 space-y-12">
        {/* SECCIÓN DE COMPARTIR */}
        <section className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800">
            Comparte esta página a un conocido, y gana puntos para canjear una promoción
          </h3>
          <div className="max-w-lg mx-auto mt-6 border border-gray-300 rounded-xl p-2">
            <div className="flex">
              <input 
                type="email" 
                placeholder="Escribe un correo electrónico" 
                className="w-full px-4 py-3 border-none focus:outline-none focus:ring-0 rounded-l-lg"
              />
              <button className="bg-green-100 text-green-700 font-bold px-8 py-3 rounded-lg hover:bg-green-200 transition-colors whitespace-nowrap">
                Compartir
              </button>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE EMPEZAR A PLANIFICAR */}
        <section className="border border-gray-300 rounded-2xl p-4 md:p-8">
          <div className="bg-blue-100 rounded-xl p-8 md:p-12 text-center relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg">
              <IoLocationSharp size={32} className="text-amber-500" />
            </div>

            <h2 className="text-4xl font-russo-one text-gray-800 mt-4">
              Empieza a planificar tu viaje
            </h2>
            <p className="text-gray-600 mt-2">
              Chatea con un especialista local que pueda ayudarte a organizar tu viaje.
            </p>
            <button className="bg-amber-500 text-gray-800 font-bold text-lg px-8 py-3 rounded-lg mt-8 hover:bg-amber-600 transition-colors">
              Empezar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
export default FinalCta;

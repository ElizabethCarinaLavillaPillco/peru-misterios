import React from 'react';
import CategoriaPills from "./CategoriaPills";

export default function EncabezadoPaquetes() {
  return (
    <header className="bg-gradient-to-b from-white to-[#FFF8EA] pb-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-10 text-center">
        <h1 className="font-russo text-4xl sm:text-5xl text-[var(--pm-black,#1E1E1E)]">
          Paquetes imperdibles en Perú
        </h1>
        <p className="mt-3 text-[var(--pm-gray-dark,#373435)]">
          Diseñados por expertos locales. Personaliza fechas, hoteles y experiencias.
        </p>

        {/* Píldoras de categoría */}
        <div className="mt-6">
          <CategoriaPills />
        </div>
      </div>
    </header>
  );
}

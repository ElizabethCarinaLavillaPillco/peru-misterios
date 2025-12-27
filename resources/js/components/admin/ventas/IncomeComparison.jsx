// src/components/admin/ventas/IncomeComparison.jsx
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const toursData = [
  {
    name: 'Machu Picchu', location: 'Cusco', sales: 18, income: 'S/. 9,720', participants: 42, trend: 15,
    image: 'https://images.unsplash.com/photo-1526481280643-33c94628b6fa?q=80&w=2070'
  },
  {
    name: 'Lago Titicaca', location: 'Puno', sales: 12, income: 'S/. 6,480', participants: 28, trend: 8,
    image: 'https://images.unsplash.com/photo-1583724199852-a21820614e13?q=80&w=1974'
  },
  {
    name: 'Líneas de Nazca', location: 'Ica', sales: 8, income: 'S/. 3,240', participants: 16, trend: -5,
    image: 'https://images.unsplash.com/photo-1620677531779-72b834a36a99?q=80&w=1964'
  },
];

const TrendBadge = ({ value }) => {
  const isPositive = value >= 0;
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {isPositive ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
      {Math.abs(value)}%
    </span>
  );
};

const IncomeComparison = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Comparativo de Ingresos por Tour</h3>
        <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Exportar
        </button>
      </div>
      <div className="space-y-2">
        {/* Encabezados */}
        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase px-4">
          <div className="col-span-4">Tour</div>
          <div className="col-span-2 text-center">Ventas</div>
          <div className="col-span-2 text-center">Ingresos</div>
          <div className="col-span-2 text-center">Participantes</div>
          <div className="col-span-2 text-center">Tendencia</div>
        </div>
        {/* Filas de datos */}
        {toursData.map((tour, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-2 rounded-lg">
            <div className="col-span-4 flex items-center">
              <img src={tour.image} alt={tour.name} className="w-10 h-10 rounded-md object-cover mr-3" />
              <div>
                <p className="font-semibold text-sm">{tour.name}</p>
                <p className="text-xs text-gray-500">{tour.location}</p>
              </div>
            </div>
            <div className="col-span-2 text-center font-medium">{tour.sales}</div>
            <div className="col-span-2 text-center font-medium">{tour.income}</div>
            <div className="col-span-2 text-center font-medium">{tour.participants}</div>
            <div className="col-span-2 text-center"><TrendBadge value={tour.trend} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeComparison;

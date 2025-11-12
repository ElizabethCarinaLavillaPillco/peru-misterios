// src/components/admin/dashboard/StatCard.jsx

import React from 'react';

const StatCard = ({ icon, title, value, change, changeType }) => {
  const isPositive = changeType === 'positive';
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const arrowIcon = isPositive ? '↑' : '↓';

  // Ajuste para el tipo neutral (Soporte Pendiente)
  if (changeType === 'neutral') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
        <div className="text-3xl text-gray-400 mr-4">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-400">{change}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
      <div className="text-3xl text-gray-400 mr-4">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-xs ${changeColor}`}>
          <span>{arrowIcon}</span> {change}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
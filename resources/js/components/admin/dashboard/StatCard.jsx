import React from 'react';

import { IoTrendingUpOutline, IoTrendingDownOutline } from 'react-icons/io5';

export default function StatCard({ icon, title, value, change, type = 'neutral' }) {
  const getChangeColor = () => {
    if (type === 'positive') return 'text-green-600';
    if (type === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  const getIcon = () => {
    if (type === 'positive') return <IoTrendingUpOutline className="w-4 h-4" />;
    if (type === 'negative') return <IoTrendingDownOutline className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      <div className={`flex items-center gap-1 text-sm ${getChangeColor()}`}>
        {getIcon()}
        <span>{change}</span>
      </div>
    </div>
  );
}

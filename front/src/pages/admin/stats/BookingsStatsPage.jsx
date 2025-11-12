// src/app/admin/ventas/page.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

import StatCard from "../../../components/admin/dashboard/StatCard";
import SalesTrendChart from '../../../components/admin/ventas/SalesTrendChart';
import TopToursChart from '../../../components/admin/ventas/TopToursChart';
import IncomeComparison from '../../../components/admin/ventas/IncomeComparison'; // Nuevo
import PaymentsHistory from '../../../components/admin/ventas/PaymentsHistory';   // Nuevo
import { FaDollarSign, FaExchangeAlt, FaMapMarkedAlt, FaPercentage } from 'react-icons/fa';

const salesCardsData = {
    ventas: { value: 'S/. 24,580', change: '12% vs semana pasada', type: 'positive' },
    transacciones: { value: '48', change: '5% vs semana pasada', type: 'positive' },
    tours: { value: '32', change: '3% vs semana pasada', type: 'negative' },
    conversion: { value: '24%', change: '8% vs semana pasada', type: 'positive' },
};

const BookingsStatsPage = () => {
    const [filter, setFilter] = useState('hoy');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Panel de Ventas</h1>
                <div className="flex space-x-2 p-1 bg-gray-200 rounded-lg">
                    {['hoy', 'semana', 'mes', 'personalizado'].map((range) => (
                        <button key={range} onClick={() => setFilter(range)} className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${filter === range ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard {...salesCardsData.ventas} icon={<FaDollarSign />} title="Ventas Totales" />
                <StatCard {...salesCardsData.transacciones} icon={<FaExchangeAlt />} title="Transacciones" />
                <StatCard {...salesCardsData.tours} icon={<FaMapMarkedAlt />} title="Tours Vendidos" />
                <StatCard {...salesCardsData.conversion} icon={<FaPercentage />} title="Tasa Conversión" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">Tendencia de Ventas</h3>
                    <SalesTrendChart />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">Tours Más Vendidos</h3>
                    <TopToursChart />
                </div>
            </div>
            
            {/* Reemplazamos el placeholder con los nuevos componentes */}
            <IncomeComparison />
            <PaymentsHistory />
        </div>
    );
};

export default BookingsStatsPage;
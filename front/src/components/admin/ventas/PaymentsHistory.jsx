// src/components/admin/ventas/PaymentsHistory.jsx
import React from 'react';
import { FaCcVisa, FaCcMastercard, FaMoneyBillWave } from 'react-icons/fa';

const paymentsData = [
  { id: '#PM-45879', client: { name: 'María López', avatar: 'https://i.pravatar.cc/40?u=maria' }, tour: 'Machu Picchu Mágico', date: '15/06/2023', method: 'Visa', amount: 'S/ 1,250', status: 'Completado' },
  { id: '#PM-45878', client: { name: 'Carlos Méndez', avatar: 'https://i.pravatar.cc/40?u=carlos' }, tour: 'Nazca Misteriosa', date: '14/06/2023', method: 'Efectivo', amount: 'S/ 890', status: 'Completado' },
  { id: '#PM-45877', client: { name: 'Ana Torres', avatar: 'https://i.pravatar.cc/40?u=ana' }, tour: 'Lago Titicaca', date: '14/06/2023', method: 'Mastercard', amount: 'S/ 1,080', status: 'Pendiente' },
];

const getStatusBadge = (status) => {
    switch (status) {
        case 'Completado': return 'bg-green-100 text-green-800';
        case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getMethodIcon = (method) => {
    switch (method) {
        case 'Visa': return <FaCcVisa className="inline mr-2 text-blue-700" />;
        case 'Mastercard': return <FaCcMastercard className="inline mr-2 text-red-600" />;
        case 'Efectivo': return <FaMoneyBillWave className="inline mr-2 text-green-500" />;
        default: return null;
    }
}

const PaymentsHistory = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Historial de Pagos</h3>
                <div className="flex items-center space-x-2">
                    <select className="text-sm border-gray-300 rounded-lg">
                        <option>Todos los estados</option>
                        <option>Completado</option>
                        <option>Pendiente</option>
                    </select>
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Exportar
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">ID Pago</th>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Tour</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Método</th>
                            <th className="px-4 py-3">Monto</th>
                            <th className="px-4 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentsData.map((payment) => (
                            <tr key={payment.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{payment.id}</td>
                                <td className="px-4 py-3 flex items-center">
                                    <img src={payment.client.avatar} alt={payment.client.name} className="w-8 h-8 rounded-full mr-2" />
                                    {payment.client.name}
                                </td>
                                <td className="px-4 py-3">{payment.tour}</td>
                                <td className="px-4 py-3">{payment.date}</td>
                                <td className="px-4 py-3">{getMethodIcon(payment.method)} {payment.method}</td>
                                <td className="px-4 py-3 font-semibold">{payment.amount}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(payment.status)}`}>
                                        {payment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <p>Mostrando 1 al 3 de 48 transacciones</p>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">Anterior</button>
                    <button className="px-3 py-1 border rounded-lg text-white bg-indigo-600">Siguiente</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentsHistory;
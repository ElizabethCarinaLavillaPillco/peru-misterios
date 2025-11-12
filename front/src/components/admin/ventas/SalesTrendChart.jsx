// src/components/admin/ventas/SalesTrendChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';

// No es necesario registrar ChartJS de nuevo si ya se hizo en otros componentes
// que se cargan en la misma página, pero es buena práctica para la independencia del componente.
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesTrendChart = () => {
    const data = {
        labels: ['1 Nov', '2 Nov', '3 Nov', '4 Nov', '5 Nov', '6 Nov', '7 Nov'],
        datasets: [{
            label: 'Ventas',
            data: [2000, 3500, 3000, 4200, 3800, 5000, 4800],
            borderColor: 'rgba(79, 70, 229, 1)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    };
    const options = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    };
    return <Line options={options} data={data} />;
};

export default SalesTrendChart;
// src/components/admin/ventas/TopToursChart.jsx
import React from 'react';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopToursChart = () => {
    const data = {
        labels: ['Machu Picchu', 'Lago Titicaca', 'Líneas Nazca', 'Valle Sagrado', 'Amazonas'],
        datasets: [{
            label: 'Tours Vendidos',
            data: [18, 12, 8, 6, 4],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 5,
        }]
    };
    const options = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
        }
    };
    return <Bar options={options} data={data} />;
};

export default TopToursChart;

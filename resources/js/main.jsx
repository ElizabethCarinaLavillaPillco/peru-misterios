// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import App from './App.jsx';
import './assets/styles/main.css';

// Obtener Client ID desde variables de entorno
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

console.log("🔑 PayPal Client ID:", PAYPAL_CLIENT_ID ? "Configurado ✅" : "NO CONFIGURADO ❌");

// Opciones de PayPal - IMPORTANTE: usar "client-id" con guión
const paypalOptions = {
  "client-id": PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  components: "buttons", // Cargar solo los botones
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>,
);
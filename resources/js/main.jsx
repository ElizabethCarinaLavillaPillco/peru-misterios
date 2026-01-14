import React from 'react';
import App from './App.jsx';

import { createRoot } from 'react-dom/client';
import './bootstrap';
import './assets/styles/main.css';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

console.log("🔑 PayPal Client ID:", PAYPAL_CLIENT_ID ? "Configurado ✅" : "NO CONFIGURADO ❌");

const paypalOptions = {
  clientId: PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  components: "buttons",
};

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>
);
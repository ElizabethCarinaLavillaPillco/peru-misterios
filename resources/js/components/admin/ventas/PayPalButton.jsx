import React from 'react';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const [error, setError] = useState(null);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: "USD",
          },
          description: "Reserva de Tours - Book&Go",
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        brand_name: "Peru Mysterious",
        locale: "es-PE",
      },
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      console.log('✅ PayPal payment successful:', details);
      onSuccess(details);
    } catch (error) {
      console.error('❌ Error capturing PayPal order:', error);
      setError('Error al procesar el pago');
      onError(error);
    }
  };

  const onErrorHandler = (err) => {
    console.error('❌ PayPal error:', err);
    setError('Error con PayPal');
    onError(err);
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={() => {
          console.log('Payment cancelled');
        }}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 45,
        }}
      />
    </div>
  );
};

export default PayPalButton;
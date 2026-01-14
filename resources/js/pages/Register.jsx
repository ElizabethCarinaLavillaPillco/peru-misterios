// ============================================
// src/pages/Register.jsx
// ============================================
import React from 'react';

import RegisterForm from '@/components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <RegisterForm />
    </div>
  );
}
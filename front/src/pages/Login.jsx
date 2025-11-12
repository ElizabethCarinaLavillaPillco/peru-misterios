// ============================================
// src/pages/Login.jsx
// ============================================

import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <LoginForm />
    </div>
  );
}
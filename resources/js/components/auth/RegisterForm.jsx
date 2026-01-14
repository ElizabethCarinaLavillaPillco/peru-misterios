import React from 'react';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validación básica
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ['Las contraseñas no coinciden'] });
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ password: ['La contraseña debe tener al menos 8 caracteres'] });
      setLoading(false);
      return;
    }

    console.log('📝 Intentando registrar:', { ...formData, password: '***' });

    try {
      await registerUser(formData);
      console.log('✅ Registro exitoso');
      // La navegación se maneja automáticamente en el store
    } catch (error) {
      console.error('❌ Error en registro:', error);

      if (error.response?.status === 422) {
        // Errores de validación del backend
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({
          general: error.response?.data?.message || 'Error al registrar. Intenta nuevamente.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <img
              src="/logo-peru-mysterious.png"
              alt="Perú Mysterious"
              className="h-12 mx-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
          <p className="text-gray-600 mt-2">Únete a Perú Mysterious</p>
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-shake">
            <p className="text-sm">{errors.general}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent transition ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Juan Pérez"
              required
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent transition ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (Opcional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent transition"
              placeholder="+51 999 999 999"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent transition ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
            )}
          </div>

          {/* Confirmar Password */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent transition ${
                errors.password_confirmation ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
            )}
          </div>

          {/* Términos */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 w-4 h-4 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
              disabled={loading}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Acepto los{' '}
              <Link to="/terminos" className="text-pm-gold hover:text-pm-gold-dark underline">
                términos y condiciones
              </Link>
              {' '}y la{' '}
              <Link to="/privacidad" className="text-pm-gold hover:text-pm-gold-dark underline">
                política de privacidad
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-pm-gold hover:bg-pm-gold-dark active:scale-95 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-pm-gold hover:text-pm-gold-dark font-semibold underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
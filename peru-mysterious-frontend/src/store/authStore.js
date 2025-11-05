// src/store/authStore.js

import { create } from 'zustand';
import { authAPI } from '@/lib/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authAPI.login(email, password);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      return { success: true, user };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      });
      throw error;
    }
  },

  // Registro
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authAPI.register(userData);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      return { success: true, user };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Error al registrarse' 
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      });
    }
  },

  // Actualizar usuario
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  // Verificar autenticación
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }

    try {
      const user = await authAPI.me();
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      set({ isAuthenticated: false, user: null, token: null });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
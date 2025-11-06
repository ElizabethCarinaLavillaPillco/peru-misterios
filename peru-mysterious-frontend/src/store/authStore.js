// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await api.post('/login', { email, password });

          if (response.data.success) {
            const { user, token } = response.data.data;
            
            localStorage.setItem('token', token);
            set({ token, user, isAuthenticated: true });

            window.location.href = user.role === 'admin' ? '/admin' : '/mi-cuenta';
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          // Llamar al endpoint de logout en el backend
          await api.post('/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Limpiar estado local
          localStorage.removeItem('token');
          set({ token: null, user: null, isAuthenticated: false });
          window.location.href = '/login';
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await api.get('/me');
            if (response.data.success) {
              set({ 
                token, 
                user: response.data.data, 
                isAuthenticated: true 
              });
            }
          } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            set({ token: null, user: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;

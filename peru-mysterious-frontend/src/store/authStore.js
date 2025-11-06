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
      loading: false,
      error: null,

      // Register
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          console.log('🔄 Enviando registro:', userData);
          
          const response = await api.post('/register', userData);
          
          console.log('📥 Respuesta del servidor:', response.data);

          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Actualizar estado
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              loading: false,
              error: null
            });

            console.log('✅ Usuario registrado:', user);

            // Redirigir según rol (todos los registros nuevos son clientes)
            setTimeout(() => {
              window.location.href = '/mi-cuenta';
            }, 100);

            return { success: true, user };
          } else {
            throw new Error(response.data.message || 'Error en el registro');
          }
        } catch (error) {
          console.error('❌ Error en register:', error);
          
          const errorMessage = error.response?.data?.message || 'Error al registrarse';
          
          set({ 
            loading: false, 
            error: errorMessage
          });
          
          throw error;
        }
      },

      // Login
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          console.log('🔄 Intentando login:', { email });
          
          const response = await api.post('/login', { email, password });
          
          console.log('📥 Respuesta login:', response.data);

          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Actualizar estado
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              loading: false,
              error: null
            });

            console.log('✅ Login exitoso:', user);

            // Redirigir según rol
            setTimeout(() => {
              window.location.href = user.role === 'admin' ? '/admin' : '/mi-cuenta';
            }, 100);

            return { success: true, user };
          } else {
            throw new Error(response.data.message || 'Error en el login');
          }
        } catch (error) {
          console.error('❌ Error en login:', error);
          
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          
          set({ 
            loading: false, 
            error: errorMessage
          });
          
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/logout');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        } finally {
          // Limpiar todo
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            error: null
          });

          window.location.href = '/login';
        }
      },

      // Verificar autenticación
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return false;
        }

        try {
          const response = await api.get('/me');
          
          if (response.data.success) {
            const user = response.data.data;
            
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ 
              user, 
              token,
              isAuthenticated: true 
            });
            
            return true;
          } else {
            throw new Error('Usuario no autenticado');
          }
        } catch (error) {
          console.error('Error verificando auth:', error);
          
          // Limpiar todo si falla
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          set({ 
            isAuthenticated: false, 
            user: null, 
            token: null 
          });
          
          return false;
        }
      },

      // Actualizar usuario
      updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },

      // Limpiar errores
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
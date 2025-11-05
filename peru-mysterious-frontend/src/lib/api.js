// ============================================
// src/lib/api.js
// ============================================

import api from './axios';

export const authAPI = {
  // Registro
  register: async (userData) => {
    const { data } = await api.post('/register', userData);
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data.data;
  },

  // Login
  login: async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data.data;
  },

  // Logout
  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  me: async () => {
    const { data } = await api.get('/me');
    return data.data;
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    const { data } = await api.put('/profile', profileData);
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data.data;
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    const { data } = await api.post('/change-password', passwordData);
    return data;
  },
};

export const userAPI = {
  // Listar usuarios (admin)
  getAll: async (params = {}) => {
    const { data } = await api.get('/admin/users', { params });
    return data.data;
  },

  // Obtener un usuario
  getOne: async (id) => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data.data;
  },

  // Crear usuario
  create: async (userData) => {
    const { data } = await api.post('/admin/users', userData);
    return data.data;
  },

  // Actualizar usuario
  update: async (id, userData) => {
    const { data } = await api.put(`/admin/users/${id}`, userData);
    return data.data;
  },

  // Eliminar usuario
  delete: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  // Estadísticas
  stats: async () => {
    const { data } = await api.get('/admin/users/stats');
    return data.data;
  },
};

export default api;
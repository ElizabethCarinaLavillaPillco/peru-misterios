// src/lib/api.js

import api from './axios';

// ============================================
// AUTH API 
// ============================================
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

// ============================================
// USER API (Admin)
// ============================================
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

// ============================================
// TOUR API
// ============================================
export const tourAPI = {
  // Listar tours
  getAll: async (params = {}) => {
    const { data } = await api.get('/tours', { params });
    return data.data;
  },

  // Obtener un tour
  getOne: async (slug) => {
    const { data } = await api.get(`/tours/${slug}`);
    return data.data;
  },

  // Crear tour (admin)
  create: async (tourData) => {
    const { data } = await api.post('/admin/tours', tourData);
    return data.data;
  },

  // Actualizar tour (admin)
  update: async (id, tourData) => {
    const { data } = await api.put(`/admin/tours/${id}`, tourData);
    return data.data;
  },

  // Eliminar tour (admin)
  delete: async (id) => {
    const { data } = await api.delete(`/admin/tours/${id}`);
    return data;
  },

  // Estadísticas (admin)
  stats: async () => {
    const { data } = await api.get('/admin/tours/stats');
    return data.data;
  },
};

// ============================================
// CATEGORY API
// ============================================
export const categoryAPI = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data.data;
  },

  create: async (categoryData) => {
    const { data } = await api.post('/admin/categories', categoryData);
    return data.data;
  },
};

// ============================================
// BOOKING API
// ============================================
export const bookingAPI = {
  // Mis reservas
  getMyBookings: async (params = {}) => {
    const { data } = await api.get('/my-bookings', { params });
    return data.data;
  },

  // Todas las reservas (admin)
  getAll: async (params = {}) => {
    const { data } = await api.get('/admin/bookings', { params });
    return data.data;
  },

  // Obtener una reserva
  getOne: async (id) => {
    const { data } = await api.get(`/bookings/${id}`);
    return data.data;
  },

  // Crear reserva
  create: async (bookingData) => {
    const { data } = await api.post('/bookings', bookingData);
    return data.data;
  },

  // Cancelar reserva
  cancel: async (id, reason) => {
    const { data } = await api.post(`/bookings/${id}/cancel`, { reason });
    return data;
  },

  // Actualizar estado (admin)
  updateStatus: async (id, status, cancellation_reason) => {
    const { data } = await api.put(`/admin/bookings/${id}/status`, { 
      status, 
      cancellation_reason 
    });
    return data.data;
  },

  // Actualizar pago (admin)
  updatePayment: async (id, payment_status, payment_method) => {
    const { data } = await api.put(`/admin/bookings/${id}/payment`, {
      payment_status,
      payment_method,
    });
    return data.data;
  },

  // Estadísticas (admin)
  stats: async () => {
    const { data } = await api.get('/admin/bookings/stats');
    return data.data;
  },
};

// ============================================
// CART API
// ============================================
export const cartAPI = {
  // Ver carrito
  get: async () => {
    const { data } = await api.get('/cart');
    return data.data;
  },

  // Agregar al carrito
  add: async (tourId, travelDate, numberOfPeople) => {
    const { data } = await api.post('/cart', {
      tour_id: tourId,
      travel_date: travelDate,
      number_of_people: numberOfPeople,
    });
    return data.data;
  },

  // Actualizar cantidad
  update: async (id, numberOfPeople) => {
    const { data } = await api.put(`/cart/${id}`, {
      number_of_people: numberOfPeople,
    });
    return data.data;
  },

  // Eliminar item
  remove: async (id) => {
    const { data } = await api.delete(`/cart/${id}`);
    return data;
  },

  // Vaciar carrito
  clear: async () => {
    const { data } = await api.delete('/cart');
    return data;
  },

  // Checkout
  checkout: async () => {
    const { data } = await api.post('/cart/checkout');
    return data.data;
  },
};

// ============================================
// FAVORITES API
// ============================================
export const favoritesAPI = {
  // Obtener favoritos
  getAll: async (params = {}) => {
    const { data } = await api.get('/favorites', { params });
    return data.data;
  },

  // Agregar favorito
  add: async (tourId) => {
    const { data } = await api.post('/favorites', { tour_id: tourId });
    return data.data;
  },

  // Eliminar favorito
  remove: async (tourId) => {
    const { data } = await api.delete(`/favorites/${tourId}`);
    return data;
  },

  // Estadísticas
  stats: async () => {
    const { data } = await api.get('/favorites/stats');
    return data.data;
  },
};

export default api;
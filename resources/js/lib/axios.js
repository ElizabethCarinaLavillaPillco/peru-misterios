
// ============================================
// src/lib/axios.js
// ============================================

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export default api;
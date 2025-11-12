// src/store/cartStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      // Cargar carrito desde backend
      loadCart: async () => {
        try {
          set({ loading: true });
          const response = await api.get('/cart');
          set({ items: response.data || [], loading: false });
        } catch (error) {
          console.error('Error cargando carrito:', error);
          set({ loading: false });
        }
      },

      // Agregar item al carrito
      addToCart: async (tourData) => {
        try {
          set({ loading: true });
          
          const response = await api.post('/cart', {
            tour_id: tourData.tour_id,
            travel_date: tourData.travel_date,
            number_of_people: tourData.number_of_people,
          });

          // Actualizar estado local
          const currentItems = get().items;
          set({
            items: [...currentItems, response.data.data],
            loading: false,
          });

          return { success: true, data: response.data.data };
        } catch (error) {
          console.error('Error agregando al carrito:', error);
          set({ loading: false });
          throw error;
        }
      },

      // Actualizar cantidad
      updateQuantity: async (itemId, quantity) => {
        try {
          await api.put(`/cart/${itemId}`, {
            number_of_people: quantity,
          });

          // Actualizar estado local
          const items = get().items.map(item => {
            if (item.id === itemId) {
              const newSubtotal = item.price_per_person * quantity;
              return {
                ...item,
                number_of_people: quantity,
                subtotal: newSubtotal,
              };
            }
            return item;
          });

          set({ items });
        } catch (error) {
          console.error('Error actualizando cantidad:', error);
          throw error;
        }
      },

      // Eliminar item
      removeItem: async (itemId) => {
        try {
          await api.delete(`/cart/${itemId}`);

          // Actualizar estado local
          const items = get().items.filter(item => item.id !== itemId);
          set({ items });
        } catch (error) {
          console.error('Error eliminando item:', error);
          throw error;
        }
      },

      // Vaciar carrito
      clearCart: async () => {
        try {
          await api.delete('/cart');
          set({ items: [] });
        } catch (error) {
          console.error('Error vaciando carrito:', error);
          throw error;
        }
      },

      // Calcular totales
      getTotals: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = subtotal * 0.18;
        const total = subtotal + tax;

        return { subtotal, tax, total, itemCount: items.length };
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
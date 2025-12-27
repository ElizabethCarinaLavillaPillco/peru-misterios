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
          // Manejar diferentes estructuras de respuesta
          const data = response.data?.data || response.data || [];
          set({ items: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
          console.error('Error cargando carrito:', error);
          set({ items: [], loading: false });
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

          // Obtener items actuales de forma segura
          const currentItems = get().items;
          const safeItems = Array.isArray(currentItems) ? currentItems : [];
          
          // Obtener el nuevo item de la respuesta
          const newItem = response.data?.data || response.data;
          
          // Verificar si el item ya existe (por tour_id y travel_date)
          const existingIndex = safeItems.findIndex(
            item => item.tour_id === newItem.tour_id && item.travel_date === newItem.travel_date
          );
          
          let updatedItems;
          if (existingIndex >= 0) {
            // Actualizar item existente
            updatedItems = safeItems.map((item, index) => 
              index === existingIndex ? newItem : item
            );
          } else {
            // Agregar nuevo item
            updatedItems = [...safeItems, newItem];
          }
          
          set({
            items: updatedItems,
            loading: false,
          });

          return { success: true, data: newItem };
        } catch (error) {
          console.error('Error agregando al carrito:', error);
          set({ loading: false });
          throw error;
        }
      },

      // Actualizar cantidad
      updateQuantity: async (itemId, quantity) => {
        try {
          const response = await api.put(`/cart/${itemId}`, {
            number_of_people: quantity,
          });

          const updatedItem = response.data?.data || response.data;
          
          // Actualizar estado local de forma segura
          const currentItems = get().items;
          const safeItems = Array.isArray(currentItems) ? currentItems : [];
          
          const items = safeItems.map(item => {
            if (item.id === itemId) {
              return updatedItem;
            }
            return item;
          });

          set({ items });
          return { success: true };
        } catch (error) {
          console.error('Error actualizando cantidad:', error);
          throw error;
        }
      },

      // Eliminar item
      removeItem: async (itemId) => {
        try {
          await api.delete(`/cart/${itemId}`);

          // Actualizar estado local de forma segura
          const currentItems = get().items;
          const safeItems = Array.isArray(currentItems) ? currentItems : [];
          const items = safeItems.filter(item => item.id !== itemId);
          set({ items });
          return { success: true };
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

      // Limpiar carrito local (sin llamar al API)
      clearLocalCart: () => {
        set({ items: [] });
      },

      // Calcular totales
      getTotals: () => {
        const currentItems = get().items;
        const items = Array.isArray(currentItems) ? currentItems : [];
        
        const subtotal = items.reduce((sum, item) => {
          const itemSubtotal = parseFloat(item.subtotal) || 0;
          return sum + itemSubtotal;
        }, 0);
        
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
// src/store/favoritesStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,

      // Cargar favoritos desde backend
      loadFavorites: async () => {
        try {
          // Obtener información del usuario actual
          const userResponse = await api.get('/me');
          const user = userResponse.data.data;
          
          // Si es administrador, no cargar favoritos
          if (user.role === 'admin') {
            set({ favorites: [], loading: false });
            return;
          }
          
          set({ loading: true });
          const response = await api.get('/favorites');
          set({ 
            favorites: response.data.data || [], 
            loading: false 
          });
        } catch (error) {
          console.error('Error cargando favoritos:', error);
          set({ loading: false, favorites: [] });
        }
      },

      // Agregar a favoritos
      addFavorite: async (tourId) => {
        try {
          // Verificar si es administrador
          const userResponse = await api.get('/me');
          const user = userResponse.data.data;
          
          if (user.role === 'admin') {
            throw new Error('Los administradores no pueden agregar favoritos');
          }
          
          const response = await api.post('/favorites', { tour_id: tourId });
          
          const currentFavorites = get().favorites;
          set({ 
            favorites: [...currentFavorites, response.data.data] 
          });

          return { success: true };
        } catch (error) {
          console.error('Error agregando favorito:', error);
          throw error;
        }
      },

      // Eliminar de favoritos
      removeFavorite: async (tourId) => {
        try {
          // Verificar si es administrador
          const userResponse = await api.get('/me');
          const user = userResponse.data.data;
          
          if (user.role === 'admin') {
            throw new Error('Los administradores no pueden eliminar favoritos');
          }
          
          await api.delete(`/favorites/${tourId}`);
          
          const favorites = get().favorites.filter(fav => fav.tour_id !== tourId);
          set({ favorites });

          return { success: true };
        } catch (error) {
          console.error('Error eliminando favorito:', error);
          throw error;
        }
      },

      // Toggle favorito
      toggleFavorite: async (tourId) => {
        const favorites = get().favorites;
        const isFavorite = favorites.some(fav => fav.tour_id === tourId);

        if (isFavorite) {
          await get().removeFavorite(tourId);
        } else {
          await get().addFavorite(tourId);
        }
      },

      // Verificar si es favorito
      isFavorite: (tourId) => {
        return get().favorites.some(fav => fav.tour_id === tourId);
      },

      // Obtener IDs de favoritos
      getFavoriteIds: () => {
        return get().favorites.map(fav => fav.tour_id);
      },
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

export default useFavoritesStore;
// src/store/favoritesStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      favoriteIds: [],
      loading: false,
      error: null,

      // Cargar favoritos desde backend
      loadFavorites: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/favorites');
          
          // Manejar diferentes estructuras de respuesta
          const data = response.data?.data || response.data || [];
          const favoritesArray = Array.isArray(data) ? data : [];
          
          // Extraer IDs de los favoritos
          const ids = favoritesArray.map(fav => fav.tour_id || fav.id);
          
          set({ 
            favorites: favoritesArray, 
            favoriteIds: ids,
            loading: false 
          });
        } catch (error) {
          console.error('Error cargando favoritos:', error);
          set({ 
            favorites: [], 
            favoriteIds: [],
            loading: false,
            error: error.response?.data?.message || 'Error al cargar favoritos'
          });
        }
      },

      // Cargar solo los IDs de favoritos (más ligero)
      loadFavoriteIds: async () => {
        try {
          const response = await api.get('/favorites/ids');
          const data = response.data?.data || response.data || [];
          const ids = Array.isArray(data) ? data : [];
          set({ favoriteIds: ids });
        } catch (error) {
          console.error('Error cargando IDs de favoritos:', error);
          set({ favoriteIds: [] });
        }
      },

      // Verificar si un tour es favorito
      isFavorite: (tourId) => {
        const { favoriteIds } = get();
        return Array.isArray(favoriteIds) && favoriteIds.includes(tourId);
      },

      // Agregar a favoritos
      addFavorite: async (tourId) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/favorites', { tour_id: tourId });
          
          const newFavorite = response.data?.data || response.data;
          
          // Actualizar estado local
          const currentFavorites = get().favorites;
          const currentIds = get().favoriteIds;
          
          const safeFavorites = Array.isArray(currentFavorites) ? currentFavorites : [];
          const safeIds = Array.isArray(currentIds) ? currentIds : [];
          
          set({ 
            favorites: [...safeFavorites, newFavorite],
            favoriteIds: [...safeIds, tourId],
            loading: false 
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error agregando favorito:', error);
          set({ 
            loading: false,
            error: error.response?.data?.message || 'Error al agregar favorito'
          });
          throw error;
        }
      },

      // Eliminar de favoritos
      removeFavorite: async (tourId) => {
        try {
          set({ loading: true, error: null });
          await api.delete(`/favorites/${tourId}`);
          
          // Actualizar estado local
          const currentFavorites = get().favorites;
          const currentIds = get().favoriteIds;
          
          const safeFavorites = Array.isArray(currentFavorites) ? currentFavorites : [];
          const safeIds = Array.isArray(currentIds) ? currentIds : [];
          
          set({ 
            favorites: safeFavorites.filter(fav => (fav.tour_id || fav.id) !== tourId),
            favoriteIds: safeIds.filter(id => id !== tourId),
            loading: false 
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error eliminando favorito:', error);
          set({ 
            loading: false,
            error: error.response?.data?.message || 'Error al eliminar favorito'
          });
          throw error;
        }
      },

      // Toggle favorito (agregar o quitar)
      toggleFavorite: async (tourId) => {
        const isFav = get().isFavorite(tourId);
        
        if (isFav) {
          return await get().removeFavorite(tourId);
        } else {
          return await get().addFavorite(tourId);
        }
      },

      // Limpiar favoritos locales
      clearFavorites: () => {
        set({ favorites: [], favoriteIds: [], error: null });
      },

      // Limpiar error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ 
        favorites: state.favorites,
        favoriteIds: state.favoriteIds 
      }),
    }
  )
);

export default useFavoritesStore;
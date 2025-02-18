import { create } from 'zustand';

export const useFavoriteStore = create((set) => ({
  checkFavorite: false,
  setCheckFavorite: (value) => set({ checkFavorite: value }),
}));

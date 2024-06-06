import { createStore } from "zustand";

interface SearchState {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  minSquareFit?: number;
  maxSquareFit?: number;
  page: number;
  limit: number;
  updateQuery: (newQuery: string) => void;
  updateMinPrice: (newMinPrice: number) => void;
  updateMaxPrice: (newMaxPrice: number) => void;
  updateMinSquareFit: (newMinSquareFit: number) => void;
  updateMaxSquareFit: (newMaxSquareFit: number) => void;
  updatePage: (newPage: number) => void;
}

export const useSearchStore = createStore<SearchState>((set) => ({
  query: "",
  minPrice: 0,
  maxPrice: 0,
  minSquareFit: 0,
  maxSquareFit: 0,
  page: 0,
  limit: 10, // limit is set to 10 and is not adjustable
  updateQuery: (newQuery: string) => set(() => ({ query: newQuery })),
  updateMinPrice: (newMinPrice: number) =>
    set(() => ({ minPrice: newMinPrice })),
  updateMaxPrice: (newMaxPrice: number) =>
    set(() => ({ maxPrice: newMaxPrice })),
  updateMinSquareFit: (newMinSquareFit: number) =>
    set(() => ({ minSquareFit: newMinSquareFit })),
  updateMaxSquareFit: (newMaxSquareFit: number) =>
    set(() => ({ maxSquareFit: newMaxSquareFit })),
  updatePage: (newPage: number) => set(() => ({ page: newPage })),
}));

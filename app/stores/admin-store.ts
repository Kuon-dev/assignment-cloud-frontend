import { create } from "zustand";
// import { BreadcrumbItem } from '@/types'; // Define the BreadcrumbItem type

interface AdminStoreState {
  userData: any;
  setUserData: (user: any) => void;
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  userData: null,
  setUserData: (userData) => set({ userData }),
}));

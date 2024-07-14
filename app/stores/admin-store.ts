import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type UserData = Record<string, unknown>;

interface AdminState {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  payoutData: UserData | null;
  setPayoutData: (data: UserData) => void;
  editingData: UserData | null;
  setEditingData: (data: UserData) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) =>
        set((state) => ({ userData: { ...state.userData, ...data } })),
      payoutData: null,
      setPayoutData: (data) =>
        set((state) => ({ payoutData: { ...state.payoutData, ...data } })),
      editingData: null,
      setEditingData: (data) =>
        set((state) => ({ editingData: { ...state.editingData, ...data } })),
    }),
    {
      name: "admin-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

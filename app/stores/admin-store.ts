import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProfileData = {
  id: string;
  email: string | null;
  firstName: string;
  isVerified: boolean;
  lastName: string;
  phoneNumber: string | null;
  profilePictureUrl: string;
  role: number;
  admin: {
    id: string;
  } | null;
  owner: {
    id: string;
  } | null;
  tenant: {
    id: string;
  } | null;
};

type UserData = Record<string, unknown>;

interface AdminState {
  userData: ProfileData | null;
  setUserData: (data: ProfileData) => void;
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

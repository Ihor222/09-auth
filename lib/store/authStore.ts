import { create } from "zustand";
import type { User, AuthStore } from "@/types/user";

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,

  setUser: (user: User) => {
    set(() => ({ user, isAuthenticated: true }));
  },

  clearIsAuthenticated: () => {
    set(() => ({ user: null, isAuthenticated: false }));
  },
}));

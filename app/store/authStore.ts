import { create } from "zustand";


type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  init: () => void;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,

  // run once on app start (reads localStorage)
  init: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ isLoggedIn: true, token });
    }
  },

  login: (token) => {
    localStorage.setItem("token", token);
    set({ isLoggedIn: true, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ isLoggedIn: false, token: null });
  },
}));
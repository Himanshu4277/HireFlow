import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  role: string | null;
  token: string | null;
  init: () => void;
  login: (token: string, role: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  role: null,
  token: null,

  init: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      set({
        isLoggedIn: true,
        token,
        role, 
      });
    }
  },

  login: (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    set({
      isLoggedIn: true,
      token,
      role,
    });
  },

  // logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    set({
      isLoggedIn: false,
      token: null,
      role: null, // ✅ reset role
    });
  },
}));
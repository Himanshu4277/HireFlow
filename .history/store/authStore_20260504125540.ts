import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  role: string | null;
  token: string | null;
  user: { name: string } | null;
  init: () => void;
  login: (token: string, role: string, name: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  role: null,
  token: null,
  user: null,

  init: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token) {
      set({
        isLoggedIn: true,
        token,
        role,
        user: name ? { name } : null,
      });
    }
  },

  login: (token, role, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    set({
      isLoggedIn: true,
      token,
      role,
      user: { name },
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    set({
      isLoggedIn: false,
      token: null,
      role: null,
      user: null,
    });
  },
}));
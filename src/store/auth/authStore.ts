import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  permissions: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const data = await response.json();
          set({ token: data.token, user: data.user, isAuthenticated: true });
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      refreshToken: async () => {
        try {
          const response = await fetch("/api/auth/refresh");
          const data = await response.json();
          set({ token: data.token });
        } catch (error) {
          console.error("Token refresh failed:", error);
          throw error;
        }
      },
    }),
    { name: "auth-storage" }
  )
);

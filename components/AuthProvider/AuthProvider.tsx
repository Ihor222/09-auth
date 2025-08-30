"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });

        if (res.ok) {
          const user = await res.json();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        clearIsAuthenticated();
        console.error("Auth initialization failed:", error);
      }
    }

    initializeAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;

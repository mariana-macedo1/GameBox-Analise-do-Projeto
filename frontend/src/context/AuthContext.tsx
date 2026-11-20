import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { setToken, getToken } from "../services/api";
import { authService } from "../services/auth";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    authService.me().then(setUser).catch(() => setToken(null)).finally(() => setLoading(false));
  }, []);

  const value: AuthState = {
    user,
    loading,
    login: async (email, password) => {
      const r = await authService.login(email, password);
      setToken(r.token); setUser(r.user);
    },
    register: async (name, email, password) => {
      const r = await authService.register(name, email, password);
      setToken(r.token); setUser(r.user);
    },
    logout: async () => {
      try { await authService.logout(); } catch { /* ignora */ }
      setToken(null); setUser(null);
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

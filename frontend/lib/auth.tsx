'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, TOKEN_KEY, getMe, login as apiLogin, register as apiRegister } from './api';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token, user } = await apiLogin({ email, password });
      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);
      router.push('/');
    },
    [router],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token, user } = await apiRegister({ name, email, password });
      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);
      router.push('/');
    },
    [router],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) return null;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.replace('/');
  }, [loading, user, router]);

  if (loading || !user || user.role !== 'admin') return null;
  return <>{children}</>;
}

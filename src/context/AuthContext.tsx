import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthService } from '../features/auth/application/AuthService';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from '../features/auth/domain/types';
import { ProvisionalAuthAdapter } from '../features/auth/infrastructure/ProvisionalAuthAdapter';

type AuthContextValue = {
  userEmail: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  forgotPassword: (input: ForgotPasswordInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const authService = new AuthService(new ProvisionalAuthAdapter());

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{
    email: string;
    fullName: string;
  } | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;
    authService
      .getCurrentSession()
      .then((current) => {
        if (!mounted || !current) return;
        setSession({
          email: current.user.email,
          fullName: current.user.fullName,
        });
      })
      .finally(() => {
        if (mounted) setIsBootstrapping(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const next = await authService.login(input);
    setSession({ email: next.user.email, fullName: next.user.fullName });
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const next = await authService.register(input);
    setSession({ email: next.user.email, fullName: next.user.fullName });
  }, []);

  const forgotPassword = useCallback(async (input: ForgotPasswordInput) => {
    await authService.forgotPassword(input);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      userEmail: session?.email ?? null,
      userName: session?.fullName ?? null,
      isAuthenticated: Boolean(session),
      isBootstrapping,
      login,
      register,
      forgotPassword,
      logout,
    }),
    [session, isBootstrapping, login, register, forgotPassword, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

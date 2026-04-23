import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { BackendUser } from "../types/backend";
import { authTokenStore, backendApi, setUnauthorizedHandler } from "../lib/apiClient";

interface AuthContextValue {
  user: BackendUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    authTokenStore.write(null);
    setUser(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    const token = authTokenStore.read();
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    void backendApi
      .getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (!cancelled) {
          logout();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      async login(email: string, password: string) {
        const session = await backendApi.login(email, password);
        authTokenStore.write(session.access_token);
        const currentUser = await backendApi.getCurrentUser();
        setUser(currentUser);
      },
      logout,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
};

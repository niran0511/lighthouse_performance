import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      if (!tokenStore.get()) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, [logout]);

  const authenticate = useCallback((data) => {
    tokenStore.set(data.token);
    setUser(data.user);
  }, []);

  const value = useMemo(() => ({ user, isLoading, isAuthenticated: Boolean(user), authenticate, logout }), [user, isLoading, authenticate, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}


import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'shopmini_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!saved) return null;
      const parsed: unknown = JSON.parse(saved);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'username' in parsed &&
        'displayName' in parsed
      ) {
        return parsed as User;
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = (username: string, password: string): boolean => {
    const cleanUsername = username.trim();
    if (!cleanUsername || password !== '123456') {
      return false;
    }

    const authenticatedUser: User = {
      username: cleanUsername,
      displayName: cleanUsername,
    };

    setUser(authenticatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
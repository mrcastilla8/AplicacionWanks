'use client';

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar el usuario desde localStorage al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedUserStr = localStorage.getItem('wankas-user');
        if (storedUserStr) {
          const storedUser: User = JSON.parse(storedUserStr);
          setUser(storedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user from localStorage", error);
        localStorage.removeItem('wankas-user');
        setUser(null);
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (authData: User) => {
    setIsLoading(true);
    // Guardar usuario en localStorage
    localStorage.setItem('wankas-user', JSON.stringify(authData));
    setUser(authData);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wankas-user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

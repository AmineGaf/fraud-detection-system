import { createContext, useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { AxiosError } from 'axios';
import type { ReactNode } from 'react';

type User = {
  email: string;
  token: string;
  role_id: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const params = new URLSearchParams();
      params.append('username', credentials.username);
      params.append('password', credentials.password);

      const response = await axios.post(
        'http://localhost:8000/auth/login',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      const userData = {
        email: data.user_email || '',
        role_id: data.user_roleId,
        token: data.access_token
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    },
    onError: (error: AxiosError) => {
      console.error('Login failed:', error.response?.data);
      throw error;
    },
  });

  const login = async (credentials: { username: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  });

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
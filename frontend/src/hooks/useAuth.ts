import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User, UserRole, LoginCredentials, RegisterData, AuthResponse } from '../types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeRole = useCallback((role: string | undefined): UserRole => {
    if (!role) return 'student';
    const r = role.toLowerCase();
    if (r === 'teacher') return 'faculty';
    return r as UserRole;
  }, []);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser({
        ...storedUser,
        role: normalizeRole(storedUser.role)
      });
    }
    setIsLoading(false);
  }, [normalizeRole]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser({
        ...response.user,
        role: normalizeRole(response.user.role)
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [normalizeRole]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser({
        ...response.user,
        role: normalizeRole(response.user.role)
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [normalizeRole]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthManager } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import { User, LoginCredentials } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const currentUser = AuthManager.getUser();
      const isAuth = AuthManager.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(isAuth);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      const response = await ApiClient.login(credentials);
      
      if (response.success) {
        AuthManager.setAuth(response.user, response.tokens);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await ApiClient.logout();
    } catch (error) {
      console.warn('Logout API call failed');
    } finally {
      AuthManager.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    requireAuth,
  };
}
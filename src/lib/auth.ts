import { User, AuthTokens } from './types';

const TOKEN_KEY = 'sales_pulse_token';
const USER_KEY = 'sales_pulse_user';

export class AuthManager {
  static setAuth(user: User, tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, tokens.access);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// JWT token utilities
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const shouldRefreshToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    // Refresh if less than 5 minutes remaining
    return timeUntilExpiry < 300;
  } catch {
    return true;
  }
};
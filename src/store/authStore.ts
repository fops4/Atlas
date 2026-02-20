import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const initialToken = authService.getToken();
const initialUser = initialToken ? authService.getDecodedToken(initialToken)?.user : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser || null,
  token: initialToken,
  isAuthenticated: authService.isAuthenticated(),
  login: (user, token) => {
    authService.setToken(token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    authService.removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const token = authService.getToken();
    const isValid = authService.isAuthenticated();
    if (token && isValid) {
      const decoded = authService.getDecodedToken(token);
      set({ token, user: decoded?.user || null, isAuthenticated: true });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

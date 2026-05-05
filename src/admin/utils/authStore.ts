import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  discord_id: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (discord_id: string, password: string) => Promise<boolean>;
  loginWithDiscordOAuth: (discord_id: string) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('admin-token'),
  user: JSON.parse(localStorage.getItem('admin-user') || 'null'),
  isAuthenticated: !!localStorage.getItem('admin-token'),

  login: async (discord_id, password) => {
    const res = await fetch('/api/admin-auth', {
      method: 'POST', body: JSON.stringify({ discord_id, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('admin-token', data.token);
      localStorage.setItem('admin-user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  loginWithDiscordOAuth: async (discord_id) => {
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discord_id, password: '__discord_oauth__' }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('admin-token', data.token);
      localStorage.setItem('admin-user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    const token = localStorage.getItem('admin-token');
    if (!token) return;
    const res = await fetch('/api/admin-profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('admin-user', JSON.stringify(data.user));
      set({ user: data.user });
    }
  },
}));

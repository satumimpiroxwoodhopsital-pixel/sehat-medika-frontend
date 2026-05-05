import { create } from 'zustand';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  name: string;
  discord_id: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Admin login error:', error);
      return false;
    }

    // Fetch admin profile
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return false;

    const { data, error: profileError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (profileError || !data) {
      await supabase.auth.signOut();
      return false;
    }

    set({ user: data, isAuthenticated: true, loading: false });
    localStorage.setItem('admin-user', JSON.stringify(data));
    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin-user');
    set({ user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      set({ loading: false });
      return;
    }

    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (data) {
      set({ user: data, isAuthenticated: true, loading: false });
      localStorage.setItem('admin-user', JSON.stringify(data));
    } else {
      set({ loading: false });
    }
  },

  initialize: () => {
    supabase.auth.getSession().then(({ data }: any) => {
      if (data.session) {
        get().fetchProfile();
      } else {
        set({ loading: false });
      }
    });

    supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false, loading: false });
        localStorage.removeItem('admin-user');
      }
    });
  },
}));

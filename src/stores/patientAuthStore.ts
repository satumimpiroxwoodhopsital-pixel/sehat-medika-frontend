import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface PatientUser {
  id: string;
  discord_id: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
  patientId?: string;
  profileCompleted?: boolean;
}

interface PatientAuthState {
  patient: PatientUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setProfileCompleted: (patientId: string) => void;
  initialize: () => void;
}

export const usePatientAuthStore = create<PatientAuthState>()(
  persist(
    (set, get) => ({
      patient: null,
      isAuthenticated: false,
      loading: true,

      login: async () => {
        set({ loading: true });
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?type=patient`,
          },
        });
        if (error) {
          console.error('Discord login error:', error);
          set({ loading: false });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ patient: null, isAuthenticated: false });
      },

      setProfileCompleted: (patientId: string) => set((state) => ({
        patient: state.patient ? { ...state.patient, patientId, profileCompleted: true } : null,
      })),

      initialize: () => {
        // Get initial session
        supabase.auth.getSession().then(({ data }: any) => {
          if (data.session) {
            get().initialize();
          } else {
            set({ loading: false });
          }
        });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((event: string, session: any) => {
          if (event === 'SIGNED_IN' && session) {
            supabase
              .from('patients')
              .select('*')
              .eq('user_id', session.user.id)
              .single()
              .then(({ data }: any) => {
                if (data) {
                  set({
                    patient: {
                      id: data.id,
                      discord_id: data.discord_id || '',
                      username: data.name,
                      patientId: data.id,
                      profileCompleted: !!data.profileCompleted,
                    },
                    isAuthenticated: true,
                    loading: false,
                  });
                } else {
                  set({ loading: false });
                }
              });
          } else if (event === 'SIGNED_OUT') {
            set({ patient: null, isAuthenticated: false, loading: false });
          }
        });
      },
    }),
    {
      name: 'patient-auth-storage',
      partialize: (state) => ({
        patient: state.patient,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

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
    (set, _get) => ({
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
            handleSignedIn(data.session);
          } else {
            set({ loading: false });
          }
        });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((event: string, session: any) => {
          if (event === 'SIGNED_IN' && session) {
            handleSignedIn(session);
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

// Helper to handle SIGNED_IN event
async function handleSignedIn(session: any) {
  const userId = session.user.id;
  const discordId = session.user.user_metadata?.provider_id
    || session.user.identities?.[0]?.id
    || session.user.id;

  // Try to find patient record
  const { data } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (data) {
    // Patient record exists
    usePatientAuthStore.setState({
      patient: {
        id: data.id,
        discord_id: data.discord_id || discordId,
        username: data.name,
        patientId: data.id,
        profileCompleted: !!data.profile_completed,
      },
      isAuthenticated: true,
      loading: false,
    });
  } else {
    // Create new patient record
    const newPatient = {
      id: `patient_${Date.now()}`,
      user_id: userId,
      mrn: `MRN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      name: session.user.user_metadata?.full_name || session.user.email || 'Discord User',
      discord_id: discordId,
      date_of_birth: '',
      gender: 'male',
      blood_type: 'O+',
      phone: '',
      allergies: [],
      status: 'active',
      registration_date: new Date().toISOString().split('T')[0],
      profile_completed: false,
    };

    const { data: inserted } = await supabase
      .from('patients')
      .insert(newPatient)
      .select()
      .single();

    if (inserted) {
      usePatientAuthStore.setState({
        patient: {
          id: inserted.id,
          discord_id: inserted.discord_id || discordId,
          username: inserted.name,
          patientId: inserted.id,
          profileCompleted: false,
        },
        isAuthenticated: true,
        loading: false,
      });
    } else {
      usePatientAuthStore.setState({ loading: false });
    }
  }
}

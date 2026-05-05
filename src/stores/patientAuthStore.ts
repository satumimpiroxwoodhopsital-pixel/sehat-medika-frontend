import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  login: (discordUser: PatientUser) => void;
  logout: () => void;
  setProfileCompleted: (patientId: string) => void;
}

export const usePatientAuthStore = create<PatientAuthState>()(
  persist(
    (set) => ({
      patient: null,
      isAuthenticated: false,
      login: (discordUser) => set({ patient: discordUser, isAuthenticated: true }),
      logout: () => set({ patient: null, isAuthenticated: false }),
      setProfileCompleted: (patientId) => set((state) => ({
        patient: state.patient ? { ...state.patient, patientId, profileCompleted: true } : null,
      })),
    }),
    {
      name: 'patient-auth-storage',
    }
  )
);

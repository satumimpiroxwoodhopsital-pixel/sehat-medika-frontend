import { create } from 'zustand';
import type { Appointment } from '../types';

interface AppointmentStore {
  appointments: Appointment[];
  loading: boolean;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: string, updated: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  getPatientAppointments: (discordId: string) => Appointment[];
  getAppointment: (id: string) => Appointment | undefined;
  getAppointmentByRef: (refNumber: string) => Appointment | undefined;
  confirmAppointment: (id: string, doctorId: string, doctorName: string) => Promise<void>;
  fetchAppointments: () => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  loading: false,

  fetchAppointments: async () => {
    set({ loading: true });
    const res = await fetch('/api/appointments');
    const data = await res.json();
    set({ appointments: data, loading: false });
  },

  addAppointment: async (appointment) => {
    const res = await fetch('/api/appointments', {
      method: 'POST', body: JSON.stringify(appointment),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ appointments: [...state.appointments, data] }));
  },

  updateAppointment: async (id, updated) => {
    const res = await fetch('/api/appointments', {
      method: 'PUT', body: JSON.stringify({ id, ...updated }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ appointments: state.appointments.map((a) => a.id === id ? data : a) }));
  },

  deleteAppointment: async (id) => {
    await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
    set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) }));
  },

  getPatientAppointments: (discordId) => get().appointments
    .filter((a) => a.patient_discord_id === discordId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

  getAppointment: (id) => get().appointments.find((a) => a.id === id),

  getAppointmentByRef: (refNumber) => get().appointments.find((a) => a.ref_number === refNumber),

  confirmAppointment: async (id, doctorId, doctorName) => {
    await get().updateAppointment(id, { doctor_id: doctorId, doctor_name: doctorName, status: 'confirmed' });
  },
}));

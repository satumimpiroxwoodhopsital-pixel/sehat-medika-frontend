import { create } from 'zustand';
import type { Patient, MedicalRecord } from '../types';

interface PatientStore {
  patients: Patient[];
  medicalRecords: MedicalRecord[];
  loading: boolean;
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatient: (id: string) => Patient | undefined;
  getPatientByMrn: (mrn: string) => Patient | undefined;
  getPatientByDiscordId: (discordId: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
  addMedicalRecord: (record: MedicalRecord) => Promise<void>;
  updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
  getMedicalRecord: (id: string) => MedicalRecord | undefined;
  getPatientMedicalRecords: (patientId: string) => MedicalRecord[];
  fetchPatients: () => Promise<void>;
  fetchMedicalRecords: (patientId?: string) => Promise<void>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],
  medicalRecords: [],
  loading: false,

  fetchPatients: async () => {
    set({ loading: true });
    const res = await fetch('/api/patients');
    const data = await res.json();
    set({ patients: data, loading: false });
  },

  addPatient: async (patient) => {
    const res = await fetch('/api/patients', {
      method: 'POST', body: JSON.stringify(patient),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ patients: [...state.patients, data] }));
  },

  updatePatient: async (id, updated) => {
    const res = await fetch('/api/patients', {
      method: 'PUT', body: JSON.stringify({ id, ...updated }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ patients: state.patients.map((p) => p.id === id ? data : p) }));
  },

  deletePatient: async (id) => {
    await fetch(`/api/patients?id=${id}`, { method: 'DELETE' });
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
      medicalRecords: state.medicalRecords.filter((r) => r.patient_id !== id),
    }));
  },

  getPatient: (id) => get().patients.find((p) => p.id === id),
  getPatientByMrn: (mrn) => get().patients.find((p) => p.mrn === mrn),
  getPatientByDiscordId: (discordId) => get().patients.find((p) => p.discord_id === discordId),

  searchPatients: (query) => {
    const q = query.toLowerCase();
    return get().patients.filter((p) =>
      p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q) || p.cid.includes(q) || p.phone.includes(q)
    );
  },

  addMedicalRecord: async (record) => {
    const res = await fetch('/api/medical-records', {
      method: 'POST', body: JSON.stringify(record),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ medicalRecords: [...state.medicalRecords, data] }));
  },

  updateMedicalRecord: async (id, updated) => {
    const res = await fetch('/api/medical-records', {
      method: 'PUT', body: JSON.stringify({ id, ...updated }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ medicalRecords: state.medicalRecords.map((r) => r.id === id ? data : r) }));
  },

  deleteMedicalRecord: async (id) => {
    await fetch(`/api/medical-records?id=${id}`, { method: 'DELETE' });
    set((state) => ({ medicalRecords: state.medicalRecords.filter((r) => r.id !== id) }));
  },

  getMedicalRecord: (id) => get().medicalRecords.find((r) => r.id === id),

  getPatientMedicalRecords: (patientId) => get().medicalRecords
    .filter((r) => r.patient_id === patientId)
    .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()),

  fetchMedicalRecords: async (patientId?: string) => {
    const url = patientId ? `/api/medical-records?patient_id=${patientId}` : '/api/medical-records';
    const res = await fetch(url);
    const data = await res.json();
    set({ medicalRecords: data });
  },
}));

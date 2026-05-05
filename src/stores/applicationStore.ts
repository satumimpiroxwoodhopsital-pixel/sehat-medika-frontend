import { create } from 'zustand';
import type { JobApplication } from '../types';
import { jobs } from '../data/mockData';

interface ApplicationStore {
  applications: JobApplication[];
  loading: boolean;
  addApplication: (application: JobApplication) => Promise<void>;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  getApplicationsByDiscordId: (discordId: string) => JobApplication[];
  getApplication: (id: string) => JobApplication | undefined;
  getJobTitle: (jobId: string) => string;
  fetchApplications: () => Promise<void>;
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  loading: false,

  fetchApplications: async () => {
    set({ loading: true });
    const res = await fetch('/api/applications');
    const data = await res.json();
    set({ applications: data, loading: false });
  },

  addApplication: async (application) => {
    const res = await fetch('/api/applications', {
      method: 'POST', body: JSON.stringify(application),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ applications: [...state.applications, data] }));
  },

  updateApplicationStatus: async (id, status) => {
    const res = await fetch('/api/applications', {
      method: 'PUT', body: JSON.stringify({ id, status }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ applications: state.applications.map((app) => app.id === id ? data : app) }));
  },

  deleteApplication: async (id) => {
    await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
    set((state) => ({ applications: state.applications.filter((app) => app.id !== id) }));
  },

  getApplicationsByDiscordId: (discordId) => get().applications
    .filter((app) => app.discord_id === discordId)
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()),

  getApplication: (id) => get().applications.find((app) => app.id === id),

  getJobTitle: (jobId) => jobs.find((j) => j.id === jobId)?.title || 'Unknown',
}));

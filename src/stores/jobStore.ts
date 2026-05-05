import { create } from 'zustand';
import type { Job } from '../types';
// import { jobs } from '../data/mockData';

interface JobStore {
  jobs: Job[];
  loading: boolean;
  addJob: (job: Job) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJob: (id: string) => Job | undefined;
  getOpenJobs: () => Job[];
  fetchJobs: () => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  loading: false,

  fetchJobs: async () => {
    set({ loading: true });
    const res = await fetch('/api/jobs');
    const data = await res.json();
    set({ jobs: data, loading: false });
  },

  addJob: async (job) => {
    const res = await fetch('/api/jobs', {
      method: 'POST', body: JSON.stringify(job),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ jobs: [...state.jobs, data] }));
  },

  updateJob: async (id, updated) => {
    const res = await fetch('/api/jobs', {
      method: 'PUT', body: JSON.stringify({ id, ...updated }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    set((state) => ({ jobs: state.jobs.map((j) => j.id === id ? data : j) }));
  },

  deleteJob: async (id) => {
    await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) }));
  },

  getJob: (id) => get().jobs.find((j) => j.id === id),

  getOpenJobs: () => get().jobs
    .filter((j) => j.is_published && !j.is_closed)
    .sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()),
}));

import { create } from "zustand";

interface Job {
  title: string;
  company: string;
  location: string;
  apply: string;
}

interface JobStore {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
}));
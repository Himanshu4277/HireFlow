import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Job {
  title: string;
  company: string;
  location: string;
  apply?: string;
   description?: string; // ✅ add
  salary?: string; 
}

interface ResumeResult {
  feedback: string;
  improvements: string[];
  better_resume: string;
  skills: string[];
}

interface Store {
  jobs: Job[];
  result: ResumeResult | null;

  setJobs: (jobs: Job[]) => void;
  setResult: (result: ResumeResult) => void;

  clearAll: () => void; // ✅ ADD THIS
}

export const useJobStore = create<Store>()(
  persist(
    (set) => ({
      jobs: [],
      result: null,

      setJobs: (jobs) => set({ jobs }),
      setResult: (result) => set({ result }),

      // ✅ CLEAR EVERYTHING (also clears localStorage because of persist)
      clearAll: () =>
        set({
          jobs: [],
          result: null,
        }),
    }),
    {
      name: "resume-storage",
    }
  )
);
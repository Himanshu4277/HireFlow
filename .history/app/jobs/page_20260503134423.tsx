"use client";

import { useState, useEffect } from "react";
import { useJobStore } from "../../store/jobStore"; // ✅ import store
import { toast } from "sonner";
import Link from "next/link";

type JobType = {
  _id?: string;
  title: string;
  company: string;
  description: string;
  salary?: string;
  location?: string;
  apply?: string;
};

export default function JobsPage() {
  const storeJobs = useJobStore((state) => state.jobs); // ✅ api jobs
  const [allJobs, setAllJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jobs");
    if (stored) {
      useJobStore.getState().setJobs(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/api/jobs"); // ✅ no auth
        const jobData = await res.json();
        const dbJobs = jobData.data || [];

        // ✅ merge db jobs + store/api jobs
        const merged = [...dbJobs];
        storeJobs.forEach((sj) => {
          const exists = merged.find(
            (j) => j.title === sj.title && j.company === sj.company
          );
          if (!exists) merged.push(sj);
        });

        setAllJobs(merged);
      } catch (error) {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [storeJobs]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (allJobs.length === 0) {
    return <div className="text-center mt-20">No jobs found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">
          Job <span className="text-indigo-400">Board</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {allJobs.length} open positions
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {allJobs.map((job, i) => (
          <Link
            key={job._id || i}
            href={job._id ? `/jobs/${job._id}` : (job.apply || "#")}
            target={job._id ? "_self" : "_blank"}
            className="group relative block bg-slate-900 border border-slate-800 rounded-2xl px-8 py-6 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(99,102,241,0.08)] transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-lg font-bold text-slate-100">{job.title}</h2>
              {job.salary && (
                <span className="text-sm font-semibold text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
                  {job.salary}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-slate-400">{job.company}</span>
              {job.location && (
                <>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span className="text-sm text-slate-500">📍 {job.location}</span>
                </>
              )}
            </div>

            {job.description && (
              <p className="text-sm text-slate-500 line-clamp-2 mb-5">
                {job.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-600 bg-slate-800 px-2 py-1 rounded">
                Full-time
              </span>
              <span className="text-xs font-bold uppercase text-indigo-400">
                View Details →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
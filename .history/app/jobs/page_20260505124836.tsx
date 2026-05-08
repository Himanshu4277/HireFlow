"use client";

import { useState, useEffect } from "react";
import { useJobStore } from "@/store/jobStore";
import Link from "next/link";

type JobType = {
  _id?: string;
  title: string;
  company: string;
  description?: string;
  salary?: string;
  location?: string;
  apply?: string;
};

export default function JobsPage() {
  const storeJobs = useJobStore((state) => state.jobs);
  const setJobs = useJobStore((state) => state.setJobs);

  const [allJobs, setAllJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);

   
  useEffect(() => {
    const stored = localStorage.getItem("jobs");
    if (stored) {
      setJobs(JSON.parse(stored));
    }
  }, [setJobs]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/api/jobs");
        const jobData = await res.json();
        const dbJobs = jobData.data || [];

        const merged = [...dbJobs];

        storeJobs.forEach((sj) => {
          const exists = merged.find(
            (j) => j.title === sj.title && j.company === sj.company
          );
          if (!exists) merged.push(sj);
        });

        setAllJobs(merged);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [storeJobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

   
  if (allJobs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        No jobs found
      </div>
    );
  }


  const content = (job: JobType) => (
    <div className="group relative block bg-slate-900 border border-slate-800 rounded-2xl px-8 py-6 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(99,102,241,0.08)] transition-all duration-200 cursor-pointer overflow-hidden">

      {/* left accent */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* title + salary */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h2 className="text-lg font-bold text-slate-100">{job.title}</h2>
        {job.salary && (
          <span className="text-sm font-semibold text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
            {job.salary}
          </span>
        )}
      </div>

      {/* company + location */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-slate-400">{job.company}</span>
        {job.location && (
          <>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span className="text-sm text-slate-500">📍 {job.location}</span>
          </>
        )}
      </div>

      {/* description */}
      {job.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-5">
          {job.description}
        </p>
      )}

      {/* footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-600 bg-slate-800 px-2 py-1 rounded">
          Full-time
        </span>

        <span className="text-xs font-bold uppercase text-indigo-400">
          {job._id ? "View Details →" : "Apply on Site →"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">
          Job <span className="text-indigo-400">Board</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {allJobs.length} open positions
        </p>
      </div>

      {/* Jobs list */}
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {allJobs.map((job, i) =>
          job._id ? (
             ✅ Internal DB job
            <Link key={job._id} href={`/jobs/${job._id}`}>
              {content(job)}
            </Link>
          ) : (
             ✅ External API job
            <div
              key={i}
              onClick={() => {
                if (job.apply) {
                  window.open(job.apply, "_blank");
                } else {
                  alert("Apply link not available");
                }
              }}
            >
              {content(job)}
            </div>
          )
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

type JobType = {
  _id: string;
  title: string;
  company: string;
  description: string;
  salary?: string;
  location?: string;
  postedBy?: string;
};

const statusConfig = {
  none: {
    label: "Apply Now",
    className:
      "bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white shadow-lg shadow-violet-900/30",
    disabled: false,
  },
  pending: {
    label: "Application Pending",
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-default",
    disabled: true,
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default",
    disabled: true,
  },
  rejected: {
    label: "Not Selected",
    className: "bg-red-500/10 text-red-400 border border-red-500/30 cursor-default",
    disabled: true,
  },
};

export default function JobDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { isLoggedIn, token, role } = useAuthStore();

  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"none" | "pending" | "accepted" | "rejected">("none");

  useEffect(() => {
    if (!token || !params?.id) return;
    async function checkApplication() {
      try {
        const res = await fetch("/api/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) return;
        const found = data.data.find((app: any) => app.job?._id === params.id);
        if (found) setStatus(found.status);
      } catch (err) {
        console.error(err);
      }
    }
    checkApplication();
  }, [token, params?.id]);

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!params?.id || !token) return;
    async function fetchJob() {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) { setJob(null); return; }
        setJob(data.data);
      } catch (err) {
        console.error(err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [params?.id, token]);

  const handleClick = async () => {
    if (!isLoggedIn) { router.push("/login"); return; }
    if (role === "recruiter") return toast.error("Recruiters can't apply");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: job?._id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Applied successfully");
        setStatus("pending");
      } else {
        toast.error(data.message || "Failed to apply");
        if (data.message === "Already applied") setStatus("pending");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm tracking-wide">Fetching job details…</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-5xl">🕵️</p>
          <h2 className="text-slate-200 text-xl font-semibold">Job not found</h2>
          <p className="text-slate-500 text-sm">This listing may have been removed.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-violet-400 hover:text-violet-300 text-sm underline underline-offset-4"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[status];
  const initials = job.company
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#080b14] text-white px-4 py-14">
      {/* Back */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to listings
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header card */}
        <div className="bg-[#0f1420] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-5">
          {/* Company avatar */}
          <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-violet-300 font-semibold text-base tracking-tight">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-slate-100 leading-snug">{job.title}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{job.company}</p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {job.location && (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.72 3.5 6.5 3.5 6.5s3.5-3.78 3.5-6.5C9.5 2.57 7.93 1 6 1Zm0 4.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" fill="currentColor" />
                  </svg>
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="inline-flex  items-center gap-1.5 text-xs text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v1M6 10v1M3.17 3.17l.71.71M8.12 8.12l.71.71M1 6h1M10 6h1M3.17 8.83l.71-.71M8.12 3.88l.71-.71" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {job.salary}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description card */}
        <div className="bg-[#0f1420] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-4">
            About this role
          </h2>
          <p className="text-slate-300  text-[15px] leading-[1.85] whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Apply card */}
        <div className="bg-[#0f1420] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            {status === "none" && (
              <p className="text-slate-400 text-sm">Ready to take the next step?</p>
            )}
            {status === "pending" && (
              <p className="text-amber-400/80 text-sm">Your application is under review.</p>
            )}
            {status === "accepted" && (
              <p className="text-emerald-400/80 text-sm">
                You've been selected! Check your email for next steps.
              </p>
            )}
            {status === "rejected" && (
              <p className="text-red-400/80 text-sm">
                This application was not successful. Keep going!
              </p>
            )}
          </div>
          <button
            onClick={handleClick}
            disabled={currentStatus.disabled}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${currentStatus.className}`}
          >
            {currentStatus.label}
          </button>
        </div>

        {/* Accepted banner */}
        {status === "accepted" && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-emerald-300 font-medium text-sm">Congratulations!</p>
                <p className="text-emerald-400/70 text-sm mt-0.5 leading-relaxed">
                  The recruiter will be in touch soon. Keep an eye on your inbox for further details.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
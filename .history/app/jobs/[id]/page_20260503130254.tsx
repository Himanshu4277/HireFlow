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
  apply?: string;
};

const statusConfig = {
  none: {
    label: "Apply Now",
    className:
      "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30",
    disabled: false,
  },
  pending: {
    label: "Application Pending",
    className:
      "bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-default",
    disabled: true,
  },
  accepted: {
    label: "Accepted",
    className:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default",
    disabled: true,
  },
  rejected: {
    label: "Not Selected",
    className:
      "bg-red-500/10 text-red-400 border border-red-500/30 cursor-default",
    disabled: true,
  },
};

export default function JobDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { token, role } = useAuthStore();

  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [status, setStatus] = useState<"none" | "pending" | "accepted" | "rejected">("none");

  // ✅ Fetch job — no auth required
  useEffect(() => {
    if (!params?.id) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${params.id}`);
        const data = await res.json();
        if (!res.ok) { setJob(null); return; }
        setJob(data.data);
      } catch (err) {
        console.error(err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params?.id]);

  // ✅ Check application status — only if logged in
  useEffect(() => {
    if (!token || !params?.id) return;

    const checkApplication = async () => {
      try {
        const res = await fetch(`/api/applications?jobId=${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setStatus(data.data.status);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkApplication();
  }, [token, params?.id]);

  // ✅ Apply — redirect to login if not logged in
  const handleApply = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (role === "recruiter") {
      toast.error("Recruiters can't apply");
      return;
    }

    try {
      setApplying(true);

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
      }
    } else if (res.status === 409) { // ✅ handle duplicate
      toast.error("You already applied");
      setStatus("pending");
    } else {
      toast.error(data.message || "Failed to apply");
      if (data.message === "You already applied") {
        setStatus("pending");
      }
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setApplying(false);
  }
};

if (loading) {
  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

if (!job) {
  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center text-white">
      Job not found
    </div>
  );
}

const currentStatus = statusConfig[status] || statusConfig.none;

return (
  <div className="min-h-screen bg-[#080b14] text-white px-4 py-14">
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-[#0f1420] border border-white/[0.06] rounded-2xl p-6">
        <h1 className="text-xl font-semibold">{job.title}</h1>
        <p className="text-slate-400 text-sm mt-1">{job.company}</p>
        <div className="flex gap-3 mt-3 text-xs">
          {job.location && <span>{job.location}</span>}
          {job.salary && <span>{job.salary}</span>}
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#0f1420] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-sm text-slate-400 mb-3">About this role</h2>
        <p className="text-sm text-slate-300 whitespace-pre-wrap">
          {job.description}
        </p>
      </div>

      {/* Apply Section */}
      <div className="bg-[#0f1420] border border-white/[0.06] rounded-2xl p-6 flex justify-between items-center">
        <button
          onClick={handleApply}
          disabled={currentStatus.disabled || applying}
          className={`px-5 py-2.5 rounded-lg text-sm ${currentStatus.className}`}
        >
          {applying ? "Applying..." : currentStatus.label}
        </button>

        {job.apply && (
          <a href={job.apply} target="_blank" className="text-violet-400 text-sm underline">
            Apply on company site →
          </a>
        )}
      </div>

    </div>
  </div>
);
}
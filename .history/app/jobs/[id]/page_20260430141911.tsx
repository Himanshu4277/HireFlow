"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
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

export default function JobDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { isLoggedIn, token, role } = useAuthStore();

  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [status, setStatus] = useState<"none" | "pending" | "accepted" | "rejected">("none");

  useEffect(() => {
    if (!token || !params?.id) return;

    async function checkApplication() {
      try {
        const res = await fetch("/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) return;

        const found = data.data.find(
          (app: any) => app.job?._id === params.id
        );

        if (found) {
          setStatus(found.status); // pending / accepted / rejected
        }
      } catch (err) {
        console.error(err);
      }
    }

    checkApplication();
  }, [token, params?.id]);

  // 🔒 Protect route
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // 📡 Fetch job details
  useEffect(() => {
    if (!params?.id || !token) return;

    async function fetchJob() {
      try {
        setLoading(true);

        const res = await fetch(`/api/jobs/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setJob(null);
          return;
        }

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

  // 🚀 Apply handler
  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (role === "recruiter") {
      return toast.error("Recruiters can't apply");
    }

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
        setApplied(true);
      } else {
        toast.error(data.message || "Failed to apply");

        // optional: if backend sends "Already applied"
        if (data.message === "Already applied") {
          setApplied(true);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // ⛔ prevent flicker
  if (!isLoggedIn) return null;

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center mt-20">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {job.title}
          </h1>
          <p className="text-slate-400 mt-2">{job.company}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-sm">
          {job.location && (
            <span className="bg-slate-800 px-3 py-1 rounded-full">
              📍 {job.location}
            </span>
          )}
          {job.salary && (
            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full">
              {job.salary}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-lg font-semibold mb-3">
            Description
          </h2>
          <p className="text-slate-300 leading-7 whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleClick}
          disabled={status !== "none"}
          className="p-2 bg-yellow-700 rounded-2xl disabled:opacity-50"
        >
          {status === "none" && "Apply Now"}
          {status === "pending" && "Applied"}
          {status === "accepted" && "Accepted ✅"}
          {status === "rejected" && "Rejected ❌"}
        </button>
        )}
      </div>
    </div>
  );
}
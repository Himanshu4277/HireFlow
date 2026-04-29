"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RecruiterDashboard() {
  const { token, role } = useAuthStore();
  const router = useRouter();

  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "recruiter") {
      router.push("/");
      return;
    }
  }, [role]);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch("/api/applications/recruiter", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setApps(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [token]);

  const updateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appId, status }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Updated");
        setApps(prev =>
          prev.map(a =>
            a._id === appId ? { ...a, status } : a
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error updating");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl mb-6">Applicants</h1>

      {apps.length === 0 && <p>No applicants yet</p>}

      {apps.map(app => (
        <div key={app._id} className="border p-4 mb-4 rounded">
          <h2>{app.jobId?.title}</h2>
          <p>{app.userId?.username} ({app.userId?.email})</p>
          <p>Status: {app.status}</p>

          {app.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => updateStatus(app._id, "accepted")}
                className="bg-green-600 px-3 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(app._id, "rejected")}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
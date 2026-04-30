"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function JobPostForm() {
    const router = useRouter()

    const { isLoggedIn, role, token } = useAuthStore()

    const initialValue = {
        title: "",
        company: "",
        description: "",
        salary: "",
        location: ""
    }
    const [recruiterForm, setRecruiterForm] = useState(initialValue)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        if (role !== "recruiter") {
            router.push("/");
        }
    }, [role, isLoggedIn, router]);

    // ⛔ Prevent UI flicker
    if (!isLoggedIn || role !== "recruiter") {
        return null;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(recruiterForm),
            });

            const data = await res.json();
            console.log("APi", data);

            if (!res.ok) {
                alert(data.message || "Error Posting Data");
                return;
            }

            setRecruiterForm(initialValue);
toast.success("Job Posted SuccessFully")
            router.push("/")
        } catch (error) {
            console.error(error);
            alert("Server error");
        }
        finally {
            setLoading(false);
        }
    }



    return (
        <main className="min-h-screen bg-[#F5F2EC] flex items-center justify-center px-4 py-16">

            <div className="pointer-events-none fixed top-0 right-0 w-[480px] h-[480px] rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, #e8c99a 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <div className="pointer-events-none fixed bottom-0 left-0 w-[360px] h-[360px] rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #c8873a 0%, transparent 70%)", transform: "translate(-40%, 40%)" }} />

            <div className="relative w-full max-w-2xl font-body">

                {/* Top label */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#C8873A] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                        </svg>
                    </div>
                    <span className="text-xs font-medium tracking-[0.18em] uppercase text-[#9A8A7A]">Recruiter Portal</span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] overflow-hidden">

                    {/* Card header */}
                    <div className="px-8 pt-8 pb-6 border-b border-[#F0EBE3]">
                        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[2rem] font-semibold text-[#1C1713] leading-tight">
                            Post a New Job
                        </h1>
                        <p className="text-sm text-[#9A8A7A] mt-1.5 font-light">
                            Complete the form below to publish your opening to candidates.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Form body */}
                        <div className="px-8 py-8 space-y-6">

                            {/* Row 1: Title + Company */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium uppercase tracking-widest text-[#9A8A7A]">
                                        Job Title <span className="text-[#C8873A]">*</span>
                                    </label>
                                    <input
                                        name="title"
                                        type="text"
                                        value={recruiterForm.title}
                                        onChange={(e: any) => { setRecruiterForm({ ...recruiterForm, title: e.target.value }) }}
                                        placeholder="e.g. Senior Product Designer"
                                        className="input-field border rounded p-2 placeholder-gray-300 text-gray-600 outline-amber-600"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium uppercase tracking-widest text-[#9A8A7A]">
                                        Company <span className="text-[#C8873A]">*</span>
                                    </label>
                                    <input
                                        name="company"
                                        type="text"
                                        value={recruiterForm.company}
                                        onChange={(e: any) => { setRecruiterForm({ ...recruiterForm, company: e.target.value }) }}
                                        placeholder="e.g. Acme Inc."
                                        className="input-field border rounded p-2 placeholder-gray-300 text-gray-600 outline-amber-600"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Location + Salary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium uppercase tracking-widest text-[#9A8A7A]">
                                        Location <span className="text-[#C8873A]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-[#C0B8AE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                        <input
                                            name="location"
                                            type="text"
                                            placeholder="Remote / City, Country"
                                            value={recruiterForm.location}
                                            onChange={(e: any) => { setRecruiterForm({ ...recruiterForm, location: e.target.value }) }}
                                            className="input-field border rounded p-2 placeholder-gray-300 text-gray-600 outline-amber-600"
                                            style={{ paddingLeft: "2.2rem" }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-[#9A8A7A]">
                                            Salary
                                        </label>
                                        <span className="text-[10px] text-[#B0A99F]">Optional · Annual USD</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0B8AE] text-sm select-none font-medium">$</span>
                                        <input
                                            name="salary"
                                            type="number"
                                            min={0}
                                            placeholder="120000"
                                            value={recruiterForm.salary}
                                            onChange={(e: any) => { setRecruiterForm({ ...recruiterForm, salary: e.target.value }) }}
                                            className="input-field border rounded p-2 placeholder-gray-300 text-gray-600 outline-amber-600"
                                            style={{ paddingLeft: "1.75rem" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-widest text-[#9A8A7A]">
                                    Job Description <span className="text-[#C8873A]">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    rows={7}
                                    value={recruiterForm.description}
                                    onChange={(e: any) => { setRecruiterForm({ ...recruiterForm, description: e.target.value }) }}
                                    placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity unique…"
                                    className="input-field border rounded p-2 placeholder-gray-300 text-gray-600 outline-amber-600"
                                />
                                <p className="text-[11px] text-[#C0B8AE] self-end">Markdown supported</p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#F0EBE3]" />

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white tracking-wide transition-opacity duration-150 hover:opacity-90"
                                    style={{
                                        background: "linear-gradient(135deg, #C8873A 0%, #D4944A 100%)",
                                        boxShadow: "0 4px 18px rgba(200,135,58,0.30)",
                                    }}
                                >
                                    {loading ? "Posting..." : "Post Job"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRecruiterForm(initialValue)}
                                    className="px-5 py-3 rounded-xl text-sm font-medium text-[#9A8A7A] bg-[#F5F2EC] hover:bg-[#EDE8E0] transition-colors duration-150"
                                >
                                    Clear
                                </button>
                            </div>

                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#B0A99F] mt-5">
                    Fields marked <span className="text-[#C8873A]">*</span> are required.
                </p>

            </div>
        </main >
    );
}
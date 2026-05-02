"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { useJobStore } from "@/store/jobStore";


export default function ResumeUploader() {
    const setJobs = useJobStore((state) => state.setJobs);

    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const resultRef = useRef<HTMLDivElement | null>(null);

    const downloadPDF = () => {
        if (!result?.better_resume) return;

        const doc = new jsPDF();
        const marginLeft = 10;
        const marginTop = 10;
        const pageWidth = doc.internal.pageSize.getWidth();

        const lines = doc.splitTextToSize(
            result.better_resume,
            pageWidth - marginLeft * 2
        );

        doc.text(lines, marginLeft, marginTop);
        doc.save("Improved_Resume.pdf");
    };

    useEffect(() => {
        if (result && resultRef.current) {
            setTimeout(() => {
                resultRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 200);
        }
    }, [result]);

    const handleUpload = async () => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
        setLoading(true);

        // ─── 1. AI API ───────────────────────
        const res = await fetch("/api/ai", {
            method: "POST",
            body: formData,
        });

        const text = await res.text();
        console.log("RAW AI RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            alert("Server error. Please try again.");
            return;
        }

        if (!res.ok) {
            alert(data.error || "Upload failed");
            return;
        }

        const parsed = data.data;

        // ─── 2. Normalize ────────────────────
        const normalized = {
            feedback: parsed.feedback || parsed.experience || "",
            improvements: parsed.improvements || parsed.strengths || [],
            better_resume:
                parsed.better_resume ||
                parsed.improved_resume ||
                parsed.experience ||
                "",
            skills: parsed.skills || [],
        };

        setResult(normalized);

        // ─── 3. FIX: Smart skill fallback ────
        let skillsToUse = normalized.skills;

        if (!skillsToUse || skillsToUse.length === 0) {
            console.warn("No skills found → using fallback");

            skillsToUse = [
                "communication",
                "teaching",
                "management",
                "leadership",
            ];
        }

        // ─── 4. Jobs API ─────────────────────
        const jobRes = await fetch("/api/jobs/by-skills", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ skills: skillsToUse }),
        });

        if (!jobRes.ok) {
            const errText = await jobRes.text();
            console.error("JOB API ERROR:", errText);
            return;
        }

        const jobData = await jobRes.json();

        if (jobData.success) {
            setJobs(jobData.jobs); // ✅ Zustand only
        }

    } catch (err) {
        console.error("UPLOAD ERROR:", err);
        alert("Something went wrong");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
            <div className="w-full max-w-lg mx-auto flex flex-col gap-6">

                {/* Header */}
                <div>
                    <p className="text-amber-400 text-xs tracking-widest uppercase mb-2">
                        Step 1 of 3
                    </p>
                    <h1 className="text-3xl font-semibold">Upload your résumé</h1>
                    <p className="text-white/40 text-sm mt-2">
                        PDF, DOCX, or TXT · Max 10 MB
                    </p>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) setUploadedFile(file);
                    }}
                    className={`rounded-xl border-2 border-dashed p-12 flex flex-col items-center gap-4 text-center transition-all duration-200
          ${isDragging
                            ? "border-amber-400 bg-amber-400/5"
                            : uploadedFile
                                ? "border-emerald-500/50 bg-emerald-500/5"
                                : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                >
                    {uploadedFile ? (
                        <>
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                ✔
                            </div>
                            <div>
                                <p className="text-white/90 text-sm font-medium">
                                    {uploadedFile.name}
                                </p>
                                <p className="text-white/40 text-xs mt-1">
                                    {(uploadedFile.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                onClick={() => setUploadedFile(null)}
                                className="text-xs text-white/30 hover:text-white/60 underline"
                            >
                                Remove
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-white/50">
                                {isDragging ? "Drop it here" : "Drag & drop your résumé"}
                            </p>

                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setUploadedFile(file);
                                    }}
                                />
                                <span className="inline-block px-5 py-2 border border-white/15 rounded-lg text-xs text-white/50 hover:text-white/80">
                                    Browse Files
                                </span>
                            </label>
                        </>
                    )}
                </div>

                {/* Button */}
                <button
                    disabled={!uploadedFile || loading}
                    onClick={handleUpload}
                    className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase transition
          ${uploadedFile
                            ? "bg-amber-400 text-black hover:bg-amber-300"
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                >
                    {loading ? "Processing..." : "Analyze Resume →"}
                </button>

                {result && (
                    <div ref={resultRef} className="mt-16 max-w-3xl mx-auto space-y-4">

                        {/* Feedback */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <p className="text-[11px] uppercase text-zinc-500 mb-3">
                                AI Feedback
                            </p>
                            <p className="text-sm text-zinc-300 whitespace-pre-line">
                                {result.feedback}
                            </p>
                        </div>

                        {/* Improvements */}
                        {result.improvements?.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <p className="text-[11px] uppercase text-zinc-500 mb-4">
                                    Suggested Improvements
                                </p>
                                <ul className="divide-y divide-zinc-800">
                                    {result.improvements.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-3 py-3">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-amber-500" />
                                            <span className="text-sm text-zinc-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Resume */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex justify-between mb-4">
                                <p className="text-[11px] uppercase text-zinc-500">
                                    Improved Resume
                                </p>
                                <button
                                    onClick={() => navigator.clipboard.writeText(result.better_resume)}
                                    className="text-xs text-zinc-500 border px-3 py-1 rounded-lg"
                                >
                                    Copy
                                </button>
                            </div>
                            <pre className="text-zinc-400 text-xs whitespace-pre-wrap">
                                {result.better_resume}
                            </pre>
                        </div>

                        <button
                            onClick={downloadPDF}
                            className="px-5 py-2 bg-green-500 text-black rounded-lg"
                        >
                            ⬇ Download PDF
                        </button>

                        <button onClick={""}>Go to DashBoard</button>

                    </div>
                )}
            </div>
        </div>
    );
}
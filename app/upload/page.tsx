"use client";

import { useState } from "react";

export default function ResumeUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!uploadedFile) return;

        const formData = new FormData();
        formData.append("file", uploadedFile);

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Upload failed");
                return;
            }

            console.log("Success:", data);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-lg flex flex-col gap-6">

                {/* Header */}
                <div>
                    <p className="text-amber-400 text-xs tracking-widest uppercase mb-2">Step 1 of 3</p>
                    <h1 className="text-3xl font-semibold text-white">Upload your résumé</h1>
                    <p className="text-white/40 text-sm mt-2">PDF, DOCX, or TXT · Max 10 MB</p>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white/90 text-sm font-medium">{uploadedFile.name}</p>
                                <p className="text-white/40 text-xs mt-1">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                                onClick={() => setUploadedFile(null)}
                                className="text-xs text-white/30 hover:text-white/60 transition-colors underline underline-offset-4"
                            >
                                Remove
                            </button>
                        </>
                    ) : (
                        <>
                            <svg className={`w-10 h-10 transition-colors duration-200 ${isDragging ? "text-amber-400" : "text-white/20"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className={`text-sm transition-colors duration-200 ${isDragging ? "text-amber-400" : "text-white/50"}`}>
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
                                <span className="inline-block px-5 py-2 border border-white/15 rounded-lg text-xs text-white/50 hover:text-white/80 hover:border-white/30 transition-all duration-200">
                                    Browse Files
                                </span>
                            </label>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <button className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <button
                        disabled={!uploadedFile}
                        onClick={handleUpload}
                        className={`px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200
              ${uploadedFile
                                ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/10"
                            }`}
                    >
                        Continue →
                    </button>
                </div>

            </div>
        </div>
    );
}
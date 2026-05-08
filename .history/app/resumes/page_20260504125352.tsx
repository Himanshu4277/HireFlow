"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnalyzedResume {
  id: string;
  fileName: string;
  uploadedAt: string;
  score: number;
  role: string;
  feedback: string[];
  keywords: string[];
  status: "Excellent" | "Good" | "Needs Work";
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const navMain = [
  { icon: "⊞", label: "Dashboard", href: "/dashboard", active: false },
  { icon: "💼", label: "All Jobs", href: "/jobs", active: false },
  { icon: "📄", label: "My Resumes", href: "/resumes", active: true },
  { icon: "🎯", label: "Match Score", href: "/match", active: false },
];

const navTools = [
  { icon: "📊", label: "Analytics", href: "/analytics" },
  { icon: "🔗", label: "LinkedIn Review", href: "/linkedin" },
  { icon: "✉️", label: "Cover Letter", href: "/cover" },
  { icon: "⚙️", label: "Settings", href: "/settings" },
];

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const stroke = score >= 85 ? "#16a34a" : score >= 70 ? "#2563eb" : "#d97706";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={stroke} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text
        x={size / 2} y={size / 2 + 6}
        textAnchor="middle"
        fill={stroke}
        fontSize="16"
        fontWeight="700"
        fontFamily="DM Sans, sans-serif"
      >
        {score}
      </text>
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    Excellent: "bg-green-100 text-green-700",
    Good: "bg-blue-100 text-blue-700",
    "Needs Work": "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${config[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-4xl mb-5">
        📄
      </div>
      <h3 className="text-[16px] font-bold text-gray-900 mb-2">No resumes analyzed yet</h3>
      <p className="text-[13px] text-gray-400 max-w-xs leading-relaxed mb-6">
        Upload your resume and our AI will score it on 30+ criteria recruiters look for.
      </p>
      <button
        onClick={onUpload}
        className="flex items-center gap-2 px-5 py-2.5 rounded-[9px] bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-all"
      >
        📄 Upload Your First Resume
      </button>
    </div>
  );
}

// ─── Resume Card ──────────────────────────────────────────────────────────────
function ResumeCard({
  resume,
  onDelete,
  onView,
}: {
  resume: AnalyzedResume;
  onDelete: (id: string) => void;
  onView: (resume: AnalyzedResume) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-lg flex-shrink-0">
            📄
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-900 truncate">{resume.fileName}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{resume.role}</p>
          </div>
        </div>
        <ScoreRing score={resume.score} size={64} />
      </div>

      {/* Status + date */}
      <div className="flex items-center justify-between">
        <StatusBadge status={resume.status} />
        <span className="text-[10.5px] text-gray-400">{resume.uploadedAt}</span>
      </div>

      {/* Keywords */}
      {resume.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {resume.keywords.slice(0, 4).map((kw) => (
            <span key={kw} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
              {kw}
            </span>
          ))}
          {resume.keywords.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 text-[10px]">
              +{resume.keywords.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={() => onView(resume)}
          className="flex-1 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-medium transition-all"
        >
          View Report →
        </button>
        <button
          onClick={() => onDelete(resume.id)}
          className="px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-500 text-[12px] font-medium transition-all"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ─── Report Drawer ────────────────────────────────────────────────────────────
function ReportDrawer({
  resume,
  onClose,
}: {
  resume: AnalyzedResume | null;
  onClose: () => void;
}) {
  if (!resume) return null;

  const stroke = resume.score >= 85 ? "#16a34a" : resume.score >= 70 ? "#2563eb" : "#d97706";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col animate-[slideIn_0.25s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[14px] font-bold text-gray-900">{resume.fileName}</p>
            <p className="text-[11px] text-gray-400">{resume.role} · {resume.uploadedAt}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Score */}
          <div className="flex items-center gap-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <ScoreRing score={resume.score} size={80} />
            <div>
              <p className="text-[13px] font-bold text-gray-900 mb-1">Overall Score</p>
              <StatusBadge status={resume.status} />
              <p className="text-[11px] text-gray-400 mt-1.5">
                {resume.score >= 85
                  ? "Outstanding! Your resume is highly competitive."
                  : resume.score >= 70
                  ? "Good resume, minor improvements can help."
                  : "Several areas need attention to stand out."}
              </p>
            </div>
          </div>

          {/* AI Feedback */}
          <div>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-3">
              AI Feedback
            </p>
            <div className="flex flex-col gap-2">
              {resume.feedback?.length > 0 ? (
                resume.feedback.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-[9px] bg-gray-50 border border-gray-100">
                    <span className="text-green-600 text-[13px] flex-shrink-0 mt-0.5">✦</span>
                    <p className="text-[12px] text-gray-700 leading-relaxed">{f}</p>
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-gray-400">No feedback available.</p>
              )}
            </div>
          </div>

          {/* Keywords */}
          {resume.keywords?.length > 0 && (
            <div>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                Detected Keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {resume.keywords.map((kw) => (
                  <span key={kw} className="px-2.5 py-1 rounded-md bg-green-50 border border-green-100 text-green-700 text-[11px] font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <Link href="/upload">
            <button className="w-full py-2.5 rounded-[9px] bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors">
              Upload Improved Version →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ResumesPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();

  const [resumes, setResumes] = useState<AnalyzedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<AnalyzedResume | null>(null);
  const [filter, setFilter] = useState<"All" | "Excellent" | "Good" | "Needs Work">("All");
  const [search, setSearch] = useState("");

  const displayName = user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ─── Load resumes from localStorage (persisted from upload/analyze flow) ───
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const stored = localStorage.getItem("analyzedResumes");
      if (stored) {
        setResumes(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleUpload = () => {
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }
    router.push("/upload");
  };

  const handleDelete = (id: string) => {
    const updated = resumes.filter((r) => r.id !== id);
    setResumes(updated);
    localStorage.setItem("analyzedResumes", JSON.stringify(updated));
    toast.success("Resume removed");
    if (selectedResume?.id === id) setSelectedResume(null);
  };

  const filtered = resumes.filter((r) => {
    const matchFilter = filter === "All" || r.status === filter;
    const matchSearch =
      search === "" ||
      r.fileName.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const avgScore =
    resumes.length > 0
      ? Math.round(resumes.reduce((acc, r) => acc + r.score, 0) / resumes.length)
      : 0;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <div className="flex min-h-screen bg-gray-50 font-[DM_Sans,sans-serif]">

        {/* SIDEBAR */}
        <aside className="fixed top-0 left-0 h-screen w-[236px] bg-white border-r border-gray-100 flex flex-col z-30">
          <div className="flex items-center gap-3 px-4 py-[18px] border-b border-gray-100">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              ✦
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">ResumeAI</p>
              <p className="text-[10px] text-gray-400">Analyser Pro</p>
            </div>
          </div>

          <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto">
            <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Main</p>
            {navMain.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 mb-0.5 ${
                  item.active
                    ? "bg-green-50 text-green-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-3">Tools</p>
            {navTools.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150 mb-0.5"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mx-2.5 mb-2.5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-3.5">
            <p className="text-[13px] font-bold text-green-700 mb-1">Get Pro Access</p>
            <p className="text-[11px] text-green-800 leading-relaxed mb-2.5">
              Unlimited analyses, AI insights & more
            </p>
            <button className="w-full py-[7px] rounded-lg bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold transition-colors">
              Upgrade Now →
            </button>
          </div>

          <div className="px-2.5 pb-3 border-t border-gray-100 pt-2.5">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-[10px] text-gray-400">Free Plan</p>
              </div>
              <span className="text-gray-400 text-sm">⋯</span>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="ml-[236px] flex-1 flex flex-col min-h-screen">

          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 h-14 px-7 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
              <span className="text-gray-400 text-sm">🔍</span>
              <input
                placeholder="Search resumes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-44 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleUpload}
                className="flex items-center gap-2 px-4 py-[7px] rounded-lg bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold transition-colors"
              >
                📄 Upload Resume
              </button>
            </div>
          </header>

          <div className="p-7 pb-10 max-w-[1140px] w-full">

            {/* Page Title + Stats */}
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest mb-1">My Resumes</p>
                <h1 className="font-[DM_Serif_Display,serif] text-[28px] font-bold text-gray-900 leading-tight">
                  All Analyzed Resumes
                </h1>
              </div>

              {resumes.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400">Total Analyzed</p>
                    <p className="text-[22px] font-bold text-gray-900">{resumes.length}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400">Avg. Score</p>
                    <p className="text-[22px] font-bold text-green-600">{avgScore}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            {resumes.length > 0 && (
              <div className="flex gap-2 mb-6">
                {(["All", "Excellent", "Good", "Needs Work"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                      filter === f
                        ? "bg-green-600 text-white"
                        : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {f}
                    {f !== "All" && (
                      <span className="ml-1.5 opacity-70">
                        ({resumes.filter((r) => r.status === f).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200">
                <EmptyState onUpload={handleUpload} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-16">
                <p className="text-gray-400 text-[13px]">No resumes match your filter.</p>
                <button
                  onClick={() => { setFilter("All"); setSearch(""); }}
                  className="mt-3 text-green-600 text-[12px] font-semibold underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onDelete={handleDelete}
                    onView={setSelectedResume}
                  />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Report Drawer */}
      <ReportDrawer resume={selectedResume} onClose={() => setSelectedResume(null)} />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
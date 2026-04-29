"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Resume {
  id: number;
  name: string;
  role: string;
  score: number;
  uploaded: string;
  status: string;
}

interface Job {
  title: string;
  company: string;
  applicants: number;
  match: number;
  logo: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const recentResumes: Resume[] = [
  { id: 1, name: "Aanya_Sharma_Resume.pdf",  role: "Senior Frontend Developer", score: 94, uploaded: "2 min ago",  status: "Excellent"  },
  { id: 2, name: "Rohan_Mehta_CV.pdf",        role: "Data Scientist",            score: 78, uploaded: "15 min ago", status: "Good"       },
  { id: 3, name: "Priya_Nair_Resume.pdf",     role: "Product Manager",           score: 61, uploaded: "1 hr ago",   status: "Needs Work" },
  { id: 4, name: "Dev_Kapoor_CV.pdf",         role: "ML Engineer",               score: 88, uploaded: "3 hrs ago",  status: "Excellent"  },
];

const topJobs: Job[] = [
  { title: "Senior React Developer", company: "Razorpay", applicants: 48, match: 91, logo: "R" },
  { title: "AI/ML Engineer",         company: "Swiggy",   applicants: 34, match: 87, logo: "S" },
  { title: "Product Designer",       company: "Zepto",    applicants: 27, match: 79, logo: "Z" },
  { title: "Backend Engineer",       company: "CRED",     applicants: 61, match: 83, logo: "C" },
];

const tips = [
  { icon: "✦", text: "Add measurable results to bullet points (e.g., 'increased revenue by 30%')" },
  { icon: "⬡", text: "Include more action verbs — 'Led', 'Built', 'Scaled', 'Reduced'" },
  { icon: "◈", text: "Your resume is missing relevant keywords for ML Engineer roles" },
];

const breakdown = [
  { label: "Impact & Results", score: 88 },
  { label: "Keywords Match",   score: 74 },
  { label: "Formatting",       score: 95 },
  { label: "Brevity",          score: 62 },
  { label: "Action Verbs",     score: 80 },
];

const stats = [
  { label: "Resumes Analyzed",   value: "1,284", delta: "+12%", icon: "📄" },
  { label: "Jobs Matched",       value: "347",   delta: "+8%",  icon: "💼" },
  { label: "High Scorers (85+)", value: "436",   delta: "+5%",  icon: "🏆" },
  { label: "Avg. Match Rate",    value: "82%",   delta: "+3%",  icon: "🎯" },
];

const navMain = [
  { icon: "⊞", label: "Dashboard",   href: "/dashboard", active: true  },
  { icon: "💼", label: "All Jobs",    href: "/jobs",      active: false },
  { icon: "📄", label: "My Resumes", href: "/resumes",   active: false },
  { icon: "🎯", label: "Match Score", href: "/match",    active: false },
];

const navTools = [
  { icon: "📊", label: "Analytics",       href: "/analytics" },
  { icon: "🔗", label: "LinkedIn Review", href: "/linkedin"  },
  { icon: "✉️", label: "Cover Letter",    href: "/cover"     },
  { icon: "⚙️", label: "Settings",        href: "/settings"  },
];

const companies = ["Google", "Amazon", "Razorpay", "Swiggy", "Flipkart", "Zomato"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 85) return "text-green-600";
  if (s >= 70) return "text-blue-600";
  return "text-amber-600";
}
function scoreBarColor(s: number) {
  if (s >= 85) return "bg-green-500";
  if (s >= 70) return "bg-blue-500";
  return "bg-amber-500";
}
function pillClasses(s: number) {
  if (s >= 85) return "bg-green-100 text-green-700";
  if (s >= 70) return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 110 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const stroke = score >= 85 ? "#16a34a" : score >= 70 ? "#2563eb" : "#d97706";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={stroke} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text
        x={size / 2} y={size / 2 + 8}
        textAnchor="middle"
        fill={stroke}
        fontSize="22"
        fontWeight="700"
        fontFamily="DM Sans, sans-serif"
      >
        {score}
      </text>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <div className="flex min-h-screen bg-gray-50 font-[DM_Sans,sans-serif]">

        {/* ══════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════ */}
        <aside className="fixed top-0 left-0 h-screen w-[236px] bg-white border-r border-gray-100 flex flex-col z-30">

          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-[18px] border-b border-gray-100">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              ✦
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">ResumeAI</p>
              <p className="text-[10px] text-gray-400">Analyser Pro</p>
            </div>
          </div>

          {/* Nav */}
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

          {/* Upgrade Banner */}
          <div className="mx-2.5 mb-2.5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-3.5">
            <p className="text-[13px] font-bold text-green-700 mb-1">Get Pro Access</p>
            <p className="text-[11px] text-green-800 leading-relaxed mb-2.5">
              Unlimited analyses, AI insights & more
            </p>
            <button className="w-full py-[7px] rounded-lg bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold transition-colors">
              Upgrade Now →
            </button>
          </div>

          {/* User */}
          <div className="px-2.5 pb-3 border-t border-gray-100 pt-2.5">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                AK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-gray-900 truncate">Arjun Kumar</p>
                <p className="text-[10px] text-gray-400">Free Plan</p>
              </div>
              <span className="text-gray-400 text-sm">⋯</span>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════ */}
        <main className="ml-[236px] flex-1 flex flex-col min-h-screen">

          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 h-14 px-7 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
              <span className="text-gray-400 text-sm">🔍</span>
              <input
                placeholder="Search resumes, jobs…"
                className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-44 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button className="flex items-center gap-2 px-3.5 py-[7px] rounded-lg border border-gray-200 bg-white text-gray-600 text-[12px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
                🔔 Alerts
              </button>
              <Link href="/jobs">
                <button className="flex items-center gap-2 px-4 py-[7px] rounded-lg bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold transition-colors">
                  💼 Browse Jobs
                </button>
              </Link>
            </div>
          </header>

          {/* Page Body */}
          <div className="p-7 pb-10 max-w-[1140px] w-full">

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden rounded-[18px] border border-gray-200 bg-gradient-to-br from-green-50 via-white to-blue-50 p-8 mb-6 flex items-center justify-between gap-5 animate-[fadeUp_0.5s_ease_both]">
              {/* Decorative blobs */}
              <div className="absolute top-[-50px] right-[210px] w-[220px] h-[220px] rounded-full bg-green-100 opacity-40 pointer-events-none" />
              <div className="absolute bottom-[-60px] right-[60px] w-[180px] h-[180px] rounded-full bg-blue-100 opacity-30 pointer-events-none" />

              {/* Text */}
              <div className="relative z-10 max-w-[500px]">
                <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest mb-2">
                  ✦ AI-Powered Resume Analysis
                </p>
                <h1 className="font-[DM_Serif_Display,serif] text-[32px] font-bold text-gray-900 leading-tight mb-3">
                  Get expert feedback on your resume,{" "}
                  <em className="italic">instantly</em>
                </h1>
                <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6">
                  Our AI scores your resume on 30+ criteria recruiters look for. Upload now and get actionable steps to land 5× more interviews.
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-[9px] bg-green-600 hover:bg-green-700 active:-translate-y-px text-white text-[13px] font-semibold transition-all"
                  >
                    📄 Upload Resume
                  </button>
                  <Link href="/jobs">
                    <button className="flex items-center gap-2 px-5 py-2 rounded-[9px] border-[1.5px] border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 text-[13px] font-medium transition-all">
                      Browse Jobs →
                    </button>
                  </Link>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" />
              </div>

              {/* Score card */}
              <div className="relative z-10 flex-shrink-0 bg-white rounded-[14px] border border-gray-200 shadow-lg px-7 py-5 text-center min-w-[190px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                  Average Score
                </p>
                <ScoreRing score={82} size={108} />
                <p className="text-[11px] text-gray-400 mt-2.5">from 1,284 resumes</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-green-100 text-green-700">
                  ↑ 3% this week
                </span>
              </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-4 gap-3.5 mb-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-4.5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[21px]">{s.icon}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-green-100 text-green-700">
                      {s.delta}
                    </span>
                  </div>
                  <p className="text-[27px] font-bold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-[11.5px] text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── Two-column: Upload + Recents  |  Tips + Breakdown ── */}
            <div className="grid grid-cols-[1fr_330px] gap-4.5 mb-4.5">

              {/* LEFT */}
              <div className="flex flex-col gap-4">

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                  onClick={() => fileRef.current?.click()}
                  className={`rounded-[14px] border-2 border-dashed p-9 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  <div className="text-[34px] mb-2.5">📄</div>
                  <p className="text-[15px] font-bold text-gray-900 mb-1">
                    Drop your resume here to get a score
                  </p>
                  <p className="text-[12.5px] text-gray-400 mb-5">
                    PDF or DOCX · Max 5 MB · Results in under 30 seconds
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[9px] bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors"
                  >
                    Upload Resume
                  </button>
                  <p className="text-[11px] text-gray-400 mt-2.5">or drag & drop</p>
                </div>

                {/* Recent Resumes */}
                <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                      <p className="text-[13.5px] font-bold text-gray-900">Recent Analyses</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Your latest uploaded resumes</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-[12px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
                      View All
                    </button>
                  </div>

                  {recentResumes.map((r, i) => (
                    <div
                      key={r.id}
                      className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                        i < recentResumes.length - 1 ? "border-b border-gray-50" : ""
                      }`}
                    >
                      <div className="w-[38px] h-[38px] rounded-[9px] bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 truncate">{r.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {r.role} · {r.uploaded}
                        </p>
                        <div className="h-[5px] rounded-full bg-gray-200 mt-1.5 w-3/4 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(r.score)}`}
                            style={{ width: mounted ? `${r.score}%` : "0%" }}
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-[22px] font-bold leading-none ${scoreColor(r.score)}`}>
                          {r.score}
                        </p>
                        <span
                          className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${pillClasses(r.score)}`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <span className="text-gray-300 text-xl flex-shrink-0">›</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-4">

                {/* AI Tips */}
                <div className="bg-white rounded-[14px] border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-3.5">
                    <div className="w-[26px] h-[26px] rounded-[7px] bg-green-50 flex items-center justify-center text-green-600 text-[13px]">
                      ✦
                    </div>
                    <p className="text-[13.5px] font-bold text-gray-900">AI Recommendations</p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {tips.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-[9px] bg-gray-50 border border-gray-100"
                      >
                        <span className="text-green-600 text-[13px] flex-shrink-0 mt-0.5">{t.icon}</span>
                        <p className="text-[12px] text-gray-700 leading-relaxed">{t.text}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3.5 py-2 rounded-[9px] border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-600 text-[12px] font-medium transition-all flex items-center justify-center">
                    See full report →
                  </button>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white rounded-[14px] border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <p className="text-[13.5px] font-bold text-gray-900 mb-4">Score Breakdown</p>
                  {breakdown.map((item, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[12px] font-medium text-gray-700">{item.label}</span>
                        <span className={`text-[12px] font-bold ${scoreColor(item.score)}`}>
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-[5px] rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(item.score)}`}
                          style={{
                            width: mounted ? `${item.score}%` : "0%",
                            transitionDelay: `${i * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Top Matching Jobs ── */}
            <div className="bg-white rounded-[14px] border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 mb-4.5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900">Top Matching Jobs</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Based on your resume analysis</p>
                </div>
                <Link href="/jobs">
                  <button className="flex items-center gap-2 px-4 py-[7px] rounded-[9px] bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold transition-colors">
                    View All Jobs →
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {topJobs.map((job, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-green-500 hover:shadow-[0_4px_14px_rgba(22,163,74,0.1)] transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-[36px] h-[36px] rounded-[9px] bg-gray-100 flex items-center justify-center text-[15px] font-bold text-gray-700 flex-shrink-0">
                        {job.logo}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-600">{job.company}</p>
                        <p className="text-[10px] text-gray-400">{job.applicants} applicants</p>
                      </div>
                    </div>
                    <p className="text-[13px] font-bold text-gray-900 leading-snug mb-2.5">
                      {job.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-green-100 text-green-700">
                        {job.match}% match
                      </span>
                      <span className="text-gray-300 text-lg">›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Social Proof ── */}
            <div className="bg-white rounded-[14px] border border-gray-200 px-7 py-4.5 flex items-center gap-6">
              <p className="text-[11.5px] text-gray-400 font-medium whitespace-nowrap">
                Trusted by professionals at
              </p>
              {companies.map((co) => (
                <p key={co} className="text-[13px] font-bold text-gray-300 tracking-wide">
                  {co}
                </p>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* Keyframe for fade-up */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </>
  );
}
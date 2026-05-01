"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast.success("Reset link sent to email");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      {/* Subtle radial glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[480px] h-[480px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#111118] border border-white/[0.07] rounded-2xl p-8 shadow-2xl shadow-black/60">

          {/* Icon badge */}
          <div className="mb-6 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          {!sent ? (
            <>
              <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">
                Forgot your password?
              </h1>
              <p className="text-sm text-slate-400 mb-7 leading-relaxed">
                No worries — enter your email and we'll send you a reset link right away.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="
                        w-full pl-10 pr-4 py-3 rounded-xl text-sm
                        bg-white/[0.04] border border-white/[0.08]
                        text-white placeholder:text-slate-600
                        focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06]
                        transition-all duration-200
                      "
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-3 rounded-xl text-sm font-semibold
                    bg-amber-500 hover:bg-amber-400 active:scale-[0.98]
                    text-slate-950 transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500
                    flex items-center justify-center gap-2
                  "
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A10 10 0 002 12h2z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-2">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Check your inbox</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                We sent a reset link to<br />
                <span className="text-amber-400 font-medium">{email}</span>
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-5 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Back to login */}
          {!sent && (
            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to sign in
              </a>
            </div>
          )}
        </div>

        {/* Bottom label */}
        <p className="mt-6 text-center text-xs text-slate-700">
          Secured with 256-bit encryption
        </p>
      </div>
    </div>
  );
}
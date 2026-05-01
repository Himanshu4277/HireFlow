"use client";

import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const role = useAuthStore((s) => s.role)
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    ...(role === "recruiter"
      ? [{ href: "/jobs/create", label: "Create Job Profile" }]
      : []),
    { href: "/about", label: "About" },
    { href: "/contactUs", label: "Contact Us" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-amber-400 hover:text-amber-300 transition-colors duration-200"
        >
          HireFlow
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs font-medium tracking-widest uppercase text-white/50 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Controls */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-sm border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 hover:shadow-[0_0_16px_rgba(245,158,11,0.2)] transition-all duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium tracking-widest uppercase text-white/50 hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-sm bg-amber-400 text-zinc-950 hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>

      {/* Amber glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </nav>
  );
}
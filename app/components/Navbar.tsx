"use client";

import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout()
    router.push("/login");
  }

  return (
    <div className="flex justify-around p-4 bg-gray-700 text-white">
      <div className="font-extrabold text-2xl text-amber-400">
        HireFlow
      </div>

      <ul className="flex space-x-8 font-bold items-center">
        <Link href="/">Home</Link>
        <Link href="/jobs/create">Create Job Profile</Link>
        <Link href="/about">About</Link>
        <Link href="/contactUs">Contact Us</Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="cursor-pointer">Logout</button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">SignUp</Link>
          </>
        )}
      </ul>
    </div>
  );
}
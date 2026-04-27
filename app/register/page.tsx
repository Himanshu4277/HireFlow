"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


type initialStateType = {
  username: string,
  email: string,
  password: string,
  confirmPassword: string

}

export default function Register() {
  const router = useRouter()
  const initialState: initialStateType = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  const [form, setForm] = useState(initialState)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }


      setForm(initialState)
      router.push("/login")

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm">
            Join the AI Resume Analyzer platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              onChange={(e: any) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your name"
              value={form.username}
              className="w-full mt-1 p-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              onChange={(e: any) => setForm({ ...form, email: e.target.value })}
              required={true}
              value={form.email}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              onChange={(e: any) => setForm({ ...form, password: e.target.value })}
              required={true}
              value={form.password}
              placeholder="Create password"
              className="w-full mt-1 p-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              onChange={(e: any) => setForm({ ...form, confirmPassword: e.target.value })}
              required={true}
              value={form.confirmPassword}
              className="w-full mt-1 p-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
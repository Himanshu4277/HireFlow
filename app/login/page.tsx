"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'


const Login = () => {
  const login = useAuthStore((s) => s.login);
  const initialValue = {
    email: "",
    password: ""
  }


  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initialValue)

  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      setLoading(false)

      if (!form.email || !form.password) {
        alert("Email and password required");
        return;
      }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)

      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Error while Login");
        return;
      }
      login(data.token);
      setForm(initialValue)
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
    finally {
      setLoading(false)
    }
  }


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 text-sm">
              Login to access your AI Resume Analyzer dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }) }}
                placeholder="Enter your email"
                className="w-full mt-1 p-3 text-gray-600 border placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                className="w-full text-gray-600 placeholder-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#" className="text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Login.." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>

    </>
  )
}

export default Login
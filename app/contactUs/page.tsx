"use client"
import React, { useState } from 'react'
import { toast } from 'sonner'

const ContactUs = () => {

  const initialState = {
    name: "",
    email: "",
    subject: "",
    desc: ""
  }

  const [form, setform] = useState(initialState)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    const res = await fetch("/api/contactForm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message || "Something went wrong");
      return;
    }
    setform(initialState)
    toast.success("Your Form submitted Succefully")
  }

  return (
    <>
      <div className="min-h-screen  flex items-center justify-center p-6">

        <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl grid md:grid-cols-2 overflow-hidden">


          <div className="bg-indigo-600 text-white p-10 space-y-6">
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="text-indigo-100">
              We’re here to help! Reach out to us for support, feedback, or collaboration.
            </p>

            <div className="space-y-3 text-sm">
              <p>📧 support@hirFlow.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Haryana, India</p>
            </div>

            <p className="text-indigo-200 text-sm">
              We usually respond within 24 hours.
            </p>
          </div>


          <div className="p-10 space-y-6 bg-gray-800">

            <h2 className="text-2xl font-semibold ">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                value={form.name}
                name='name'
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="email"
                value={form.email}
                name='email'
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                value={form.subject}
                onChange={handleChange}
                name='subject'
                placeholder="Subject"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                value={form.desc}
                name='desc'
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>

              <button
                type="submit"
                disabled={!form.name || !form.email || !form.desc}
                className="w-full bg-indigo-600 cursor-pointer disabled:cursor-no-drop text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default ContactUs
import React from 'react'

const contactUs = () => {
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
              <p>📧 support@yourplatform.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Haryana, India</p>
            </div>

            <p className="text-indigo-200 text-sm">
              We usually respond within 24 hours.
            </p>
          </div>

         
          <div className="p-10 space-y-6 bg-gray-800">

            <h2 className="text-2xl font-semibold ">Send a Message</h2>

            <form className="space-y-4">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
          
                placeholder="Your Message"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
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

export default contactUs
"use client";

export default function JobListingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Job Listings</h1>

        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid gap-4">
          {/* Job Card */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Frontend Developer</h2>
                <p className="text-gray-600">TechNova • Remote</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                Full-time
              </span>
            </div>

            <p className="mt-3 text-gray-700">
              Build modern UI components and improve user experience using React and Tailwind.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">React</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">Tailwind</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">TypeScript</span>
            </div>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Apply Now
            </button>
          </div>

          {/* Job Card */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Backend Engineer</h2>
                <p className="text-gray-600">CloudSync • Bangalore</p>
              </div>
              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                Full-time
              </span>
            </div>

            <p className="mt-3 text-gray-700">
              Design scalable APIs and manage cloud infrastructure.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">Node.js</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">AWS</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">PostgreSQL</span>
            </div>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Apply Now
            </button>
          </div>

          {/* Job Card */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">UI/UX Designer</h2>
                <p className="text-gray-600">PixelCraft • Hybrid</p>
              </div>
              <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                Contract
              </span>
            </div>

            <p className="mt-3 text-gray-700">
              Create user-centric designs and improve product usability.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">Figma</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">UI Design</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">Prototyping</span>
            </div>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

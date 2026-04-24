export default function dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          AI Resume Dashboard
        </h1>

        <button className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Upload Resume
        </button>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow space-y-2">
          <h2 className="text-gray-400 text-sm">Total Resumes</h2>
          <p className="text-3xl font-bold">1,245</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow space-y-2">
          <h2 className="text-gray-400 text-sm">Jobs Matched</h2>
          <p className="text-3xl font-bold">389</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow space-y-2">
          <h2 className="text-gray-400 text-sm">Active Users</h2>
          <p className="text-3xl font-bold">520</p>
        </div>

      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

        {/* Activity */}
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>

          <ul className="space-y-3 text-gray-300 text-sm">
            <li>✔ Resume analyzed for John Doe</li>
            <li>✔ New job match for React Developer</li>
            <li>✔ Resume uploaded by Sarah Khan</li>
            <li>✔ AI scoring completed for 25 candidates</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>

          <div className="space-y-3">

            <button className="w-full bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition">
              Analyze Resume
            </button>

            <button className="w-full bg-gray-800 py-2 rounded-lg hover:bg-gray-700 transition">
              View Candidates
            </button>

            <button className="w-full bg-gray-800 py-2 rounded-lg hover:bg-gray-700 transition">
              Job Listings
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
  

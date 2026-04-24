export default function about() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
          <p className="text-gray-500">
            Transforming recruitment with AI-powered intelligence
          </p>
        </div>

        {/* Who We Are */}
        <div className="bg-white p-8 rounded-2xl shadow space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            We are a technology-driven platform focused on simplifying recruitment
            using Artificial Intelligence. Our AI Resume Analyzer helps recruiters
            and job seekers connect faster and smarter.
          </p>
        </div>

        {/* What We Do */}
        <div className="bg-white p-8 rounded-2xl shadow space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">What We Do</h2>
          <p className="text-gray-600 leading-relaxed">
            We analyze resumes, extract key skills, and match candidates with
            relevant job opportunities in seconds. Our system reduces manual effort
            and improves hiring accuracy.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white p-8 rounded-2xl shadow space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to make hiring faster, fairer, and more efficient by
            using AI to eliminate bias and improve decision-making in recruitment.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white p-8 rounded-2xl shadow space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Why Choose Us</h2>

          <ul className="grid md:grid-cols-2 gap-3 text-gray-600">
            <li>✔ AI-powered resume analysis</li>
            <li>✔ Instant job matching</li>
            <li>✔ Faster hiring process</li>
            <li>✔ Reduced manual screening</li>
            <li>✔ Smart candidate ranking</li>
            <li>✔ Easy-to-use dashboard</li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          Built with ❤️ to revolutionize the future of hiring
        </div>

      </div>
    </div>
  );
}
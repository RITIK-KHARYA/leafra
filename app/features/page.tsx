import Link from "next/link";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Powerful Features</h1>
          <p className="text-xl text-gray-300">
            Transform how you interact with PDF documents using AI-powered analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="text-blue-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">PDF Upload & Processing</h3>
            <p className="text-gray-300">
              Upload PDF documents up to 8MB and let our AI process them automatically for instant analysis.
            </p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="text-green-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Chat</h3>
            <p className="text-gray-300">
              Ask questions about your documents and receive accurate, contextual answers powered by advanced AI.
            </p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="text-purple-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-gray-300">
              Vector-based search ensures you get relevant information from your documents quickly and accurately.
            </p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="text-yellow-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-300">
              Your documents are encrypted and processed securely. We prioritize your privacy and data protection.
            </p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Streaming</h3>
            <p className="text-gray-300">
              Get instant responses with real-time streaming, perfect for long-form answers and detailed explanations.
            </p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="text-indigo-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Platform Support</h3>
            <p className="text-gray-300">
              Sign in with your preferred method - email/password or social accounts (Google, GitHub, Discord).
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Try Leafra Now
          </Link>
        </div>
      </div>
    </main>
  );
}

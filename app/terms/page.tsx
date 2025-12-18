import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            Welcome to Leafra. By using our AI-powered PDF analysis platform, you agree to these terms.
          </p>

          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mb-6">
            By accessing and using Leafra, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-gray-300 mb-6">
            Permission is granted to temporarily use Leafra for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-gray-300 mb-6">
            The materials on Leafra are provided on an 'as is' basis. Leafra makes no warranties, expressed or implied.
          </p>

          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="text-gray-300 mb-6">
            In no event shall Leafra or its suppliers be liable for any damages arising out of the use of our services.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Privacy Policy</h2>
          <p className="text-gray-300 mb-6">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of Leafra.
          </p>

          <p className="text-gray-400 text-sm mt-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}

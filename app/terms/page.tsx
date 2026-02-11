import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of use for Leafra's AI-powered PDF analysis platform. By using our services you agree to these terms.",
  alternates: { canonical: "https://leafraa.ai/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            Welcome to Leafra. By using our AI-powered PDF analysis platform,
            you agree to these terms.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-300 mb-6">
            By accessing and using Leafra, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-gray-300 mb-6">
            Permission is granted to temporarily use Leafra for personal,
            non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-gray-300 mb-6">
            The materials on Leafra are provided on an 'as is' basis. Leafra
            makes no warranties, expressed or implied.
          </p>

          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="text-gray-300 mb-6">
            In no event shall Leafra or its suppliers be liable for any damages
            arising out of the use of our services.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Privacy Policy</h2>
          <p className="text-gray-300 mb-6">
            Your privacy is important to us. Please review our{" "}
            <Link
              href="/privacy"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Privacy Policy
            </Link>
            , which also governs your use of Leafra.
          </p>

          <p className="text-gray-400 text-sm mt-12">
            Last updated: February 2025
          </p>
        </div>
      </div>
    </main>
  );
}

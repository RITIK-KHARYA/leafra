import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support & Help",
  description:
    "Get help with Leafra: account setup, PDF uploads, AI chat, and troubleshooting. Find answers and contact support.",
  alternates: { canonical: "https://leafraa.ai/support" },
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-gray-300">
            Get help with using Leafra and make the most of our AI-powered PDF
            analysis platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Getting Started
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  How do I create an account?
                </h3>
                <p className="text-gray-300 text-sm">
                  Click "Sign In" and choose your preferred method -
                  email/password or social login.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  What file formats are supported?
                </h3>
                <p className="text-gray-300 text-sm">
                  Currently, we support PDF files up to 8MB in size.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  How long does processing take?
                </h3>
                <p className="text-gray-300 text-sm">
                  Most documents are processed within 1-2 minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Troubleshooting
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">My upload failed</h3>
                <p className="text-gray-300 text-sm">
                  Check file size (max 8MB) and ensure it's a valid PDF. Try
                  refreshing the page.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Answers seem inaccurate
                </h3>
                <p className="text-gray-300 text-sm">
                  Try rephrasing your question or ask for specific
                  sections/pages.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Can't access my chats
                </h3>
                <p className="text-gray-300 text-sm">
                  Ensure you're signed in. Check your internet connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Is my data secure?</h3>
              <p className="text-gray-300">
                Yes, we use industry-standard encryption and security measures
                to protect your documents and personal information.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Can I delete my account?
              </h3>
              <p className="text-gray-300">
                Yes, you can delete your account and all associated data from
                your account settings.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Do you store my documents?
              </h3>
              <p className="text-gray-300">
                Documents are securely stored to provide the best experience,
                but you can delete them anytime.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                What languages are supported?
              </h3>
              <p className="text-gray-300">
                Our AI understands multiple languages and will respond in the
                same language as your questions.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-4">
            Still need help? Contact our support team.
          </p>
          <Link
            href="/how-to-use"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block mr-4"
          >
            View How-to Guide
          </Link>
          <Link
            href="/features"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block mr-4"
          >
            See Features
          </Link>
          <Link
            href="/signin"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
          >
            Sign In for Support
          </Link>
        </div>
      </div>
    </main>
  );
}

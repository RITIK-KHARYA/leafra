import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Leafra protects your privacy and handles your data. Our privacy policy covers information collection, use, and your rights.",
  alternates: { canonical: "https://leafraa.ai/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            At Leafra, we are committed to protecting your privacy and ensuring
            the security of your personal information.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-300 mb-6">
            We collect information you provide directly to us, such as when you
            create an account, upload documents, or contact us for support.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-300 mb-6">
            We use the information we collect to provide, maintain, and improve
            our services, process transactions, and communicate with you.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            3. Information Sharing
          </h2>
          <p className="text-gray-300 mb-6">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described in this policy.
          </p>

          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-gray-300 mb-6">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-gray-300 mb-6">
            You have the right to access, update, or delete your personal
            information. You may also request that we limit the processing of
            your information in certain circumstances.
          </p>

          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about this Privacy Policy, please contact
            us through our{" "}
            <Link
              href="/support"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              support
            </Link>{" "}
            channels.
          </p>

          <p className="text-gray-400 text-sm mt-12">
            Last updated: February 2025
          </p>
        </div>
      </div>
    </main>
  );
}

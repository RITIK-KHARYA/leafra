import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/custom/ContentPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Leafra protects your privacy and handles your data. Our privacy policy covers information collection, use, and your rights.",
  alternates: { canonical: "https://leafraa.ai/privacy" },
};

const sections = [
  {
    id: "1",
    title: "Information We Collect",
    body: "We collect information you provide directly to us, such as when you create an account, upload documents, or contact us for support.",
  },
  {
    id: "2",
    title: "How We Use Your Information",
    body: "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.",
  },
  {
    id: "3",
    title: "Information Sharing",
    body: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.",
  },
  {
    id: "4",
    title: "Data Security",
    body: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    id: "5",
    title: "Your Rights",
    body: "You have the right to access, update, or delete your personal information. You may also request that we limit the processing of your information in certain circumstances.",
  },
  {
    id: "6",
    title: "Contact Us",
    body: "If you have any questions about this Privacy Policy, please contact us through our support channels.",
    link: { href: "/support", label: "support" },
  },
];

export default function PrivacyPage() {
  return (
    <ContentPageLayout back={{ href: "/", label: "Back to Home" }}>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-3">
          Privacy Policy
        </h1>
        <p className="text-neutral-400">
          At Leafra, we are committed to protecting your privacy and ensuring
          the security of your personal information.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((s) => (
          <section
            key={s.id}
            className="border-l-2 border-white/10 pl-5 sm:pl-6 py-1"
          >
            <h2 className="text-lg font-semibold text-white mb-2">
              {s.id}. {s.title}
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              {s.body}
              {s.link && (
                <>
                  {" "}
                  <Link
                    href={s.link.href}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 underline underline-offset-2"
                  >
                    {s.link.label}
                  </Link>
                  .
                </>
              )}
            </p>
          </section>
        ))}
      </div>

      <p className="text-neutral-500 text-sm mt-12">
        Last updated: February 2025
      </p>
    </ContentPageLayout>
  );
}

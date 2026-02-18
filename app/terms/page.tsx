import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/custom/ContentPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of use for Leafra's AI-powered PDF analysis platform. By using our services you agree to these terms.",
  alternates: { canonical: "https://leafra-eight.vercel.app/terms" },
};

const sections = [
  {
    id: "1",
    title: "Acceptance of Terms",
    body: "By accessing and using Leafra, you accept and agree to be bound by the terms and provisions of this agreement.",
  },
  {
    id: "2",
    title: "Use License",
    body: "Permission is granted to temporarily use Leafra for personal, non-commercial transitory viewing only.",
  },
  {
    id: "3",
    title: "Disclaimer",
    body: "The materials on Leafra are provided on an “as is” basis. Leafra makes no warranties, expressed or implied.",
  },
  {
    id: "4",
    title: "Limitations",
    body: "In no event shall Leafra or its suppliers be liable for any damages arising out of the use of our services.",
  },
  {
    id: "5",
    title: "Privacy Policy",
    body: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of Leafra.",
    link: { href: "/privacy", label: "Privacy Policy" },
  },
];

export default function TermsPage() {
  return (
    <ContentPageLayout back={{ href: "/", label: "Back to Home" }}>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-3">
          Terms of Service
        </h1>
        <p className="text-neutral-400">
          Welcome to Leafra. By using our AI-powered PDF analysis platform, you
          agree to these terms.
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

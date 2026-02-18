import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/custom/ContentPageLayout";
import { Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Leafra pricing: start free with AI-powered PDF chat. Simple, transparent pricing for individuals and teams.",
  alternates: { canonical: "https://leafraa.ai/pricing" },
};

const included = [
  "PDF upload & processing (up to 8MB)",
  "AI-powered chat with your documents",
  "Vector search & semantic retrieval",
  "Real-time streaming responses",
  "Secure storage & encryption",
  "Multi-platform sign-in (email, Google, GitHub, Discord)",
];

export default function PricingPage() {
  return (
    <ContentPageLayout back={{ href: "/", label: "Back to Home" }}>
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-neutral-400 max-w-xl mx-auto">
          Start free. No credit card required. Use Leafra to chat with your PDFs
          in minutes.
        </p>
      </div>

      <div className="max-w-lg mx-auto mb-14">
        <div className="relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-linear-to-b from-emerald-950/30 to-neutral-900 border border-emerald-500/20">
          <div className="flex items-center justify-center gap-2 text-emerald-400 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Free tier
            </span>
          </div>
          <div className="text-center mb-6">
            <span className="text-4xl sm:text-5xl font-bold text-white">$0</span>
            <span className="text-neutral-400 ml-1">/ month</span>
          </div>
          <p className="text-neutral-400 text-sm text-center mb-6">
            Get started with full access to PDF upload, AI chat, and secure
            document handling.
          </p>
          <ul className="space-y-3 mb-8">
            {included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-neutral-300"
              >
                <Check className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="block w-full text-center px-6 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors duration-200"
          >
            Get started free
          </Link>
        </div>
        <p className="text-center text-neutral-500 text-sm mt-6">
          Need more? Contact us for enterprise or custom usage.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="/features"
          className="text-neutral-400 hover:text-white transition-colors duration-200"
        >
          See features
        </Link>
        <span className="text-white/20">·</span>
        <Link
          href="/how-to-use"
          className="text-neutral-400 hover:text-white transition-colors duration-200"
        >
          How to use
        </Link>
      </div>
    </ContentPageLayout>
  );
}

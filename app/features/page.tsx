import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/custom/ContentPageLayout";
import {
  FileText,
  MessageSquare,
  Search,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore Leafra's AI PDF analysis features: upload & process PDFs, AI-powered chat, vector search, real-time streaming, and secure document handling.",
  alternates: { canonical: "https://leafra-eight.vercel.app/features" },
};

const features = [
  {
    icon: FileText,
    title: "PDF Upload & Processing",
    description:
      "Upload PDFs up to 8MB and let our AI process them automatically for instant analysis.",
    accent: "emerald",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Chat",
    description:
      "Ask questions about your documents and get accurate, contextual answers powered by advanced AI.",
    accent: "cyan",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Vector-based semantic search surfaces the most relevant information from your documents.",
    accent: "violet",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your documents are encrypted and processed securely. We prioritize your privacy and data protection.",
    accent: "amber",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description:
      "Get instant responses with real-time streaming, ideal for long-form answers and detailed explanations.",
    accent: "rose",
  },
  {
    icon: Heart,
    title: "Multi-Platform Sign-in",
    description:
      "Sign in with email/password or social accounts (Google, GitHub, Discord).",
    accent: "indigo",
  },
];

const accentClass: Record<string, string> = {
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
  violet: "text-violet-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  indigo: "text-indigo-400",
};

export default function FeaturesPage() {
  return (
    <ContentPageLayout back={{ href: "/", label: "Back to Home" }}>
      <div className="text-center mb-14 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-3">
          Powerful Features
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Transform how you interact with PDF documents using AI-powered analysis.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-14">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors duration-200"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${accentClass[f.accent]}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="/how-to-use"
          className="text-neutral-400 hover:text-white transition-colors duration-200"
        >
          How to Use Leafra
        </Link>
        <span className="text-white/20">·</span>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-neutral-950 font-medium hover:bg-neutral-200 transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
    </ContentPageLayout>
  );
}

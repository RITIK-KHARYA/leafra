import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/custom/ContentPageLayout";
import { UserPlus, FileUp, MessageCircle, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Use Leafra",
  description:
    "Step-by-step guide to using Leafra: create an account, upload PDFs, and get AI-powered answers from your documents in minutes.",
  alternates: { canonical: "https://leafra-eight.vercel.app/how-to-use" },
};

const steps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    body: "Sign up using your email or social accounts (Google, GitHub, Discord) to get started with Leafra.",
  },
  {
    icon: FileUp,
    title: "Upload Your PDF",
    body: "Create a new chat and upload your PDF. Our system will process and analyze it automatically.",
    list: [
      "Supported format: PDF (up to 8MB)",
      "Processing time: usually 1–2 minutes",
      "Documents are securely stored and processed",
    ],
  },
  {
    icon: MessageCircle,
    title: "Ask Questions",
    body: "Start asking questions about your document. Our AI provides accurate answers based on the PDF content.",
    example: [
      "What are the main topics discussed in this document?",
      "Summarize the key findings from page 5",
      "Explain the methodology used in section 3",
    ],
  },
  {
    icon: LayoutGrid,
    title: "Manage Your Chats",
    body: "Access all your previous conversations from the dashboard. Each chat is tied to a specific document.",
  },
];

export default function HowToUsePage() {
  return (
    <ContentPageLayout back={{ href: "/", label: "Back to Home" }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-3">
          How to Use Leafra
        </h1>
      </div>

      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <section
              key={step.title}
              className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-3">
                    {step.body}
                  </p>
                  {step.list && (
                    <ul className="text-neutral-400 text-sm space-y-1 list-disc list-inside mb-3">
                      {step.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {step.example && (
                    <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                        Example questions
                      </p>
                      <ul className="text-neutral-400 text-sm space-y-1">
                        {step.example.map((q) => (
                          <li key={q} className="italic">
                            &ldquo;{q}&rdquo;
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-10 p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-3">
          Tips for Best Results
        </h2>
        <ul className="text-neutral-400 text-sm space-y-2">
          <li>Be specific in your questions for more accurate answers.</li>
          <li>Upload clear, high-quality PDF documents.</li>
          <li>Use the chat interface for follow-up questions.</li>
          <li>Try different phrasings if you don&apos;t get the expected answer.</li>
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="/features"
          className="text-neutral-400 hover:text-white transition-colors duration-200"
        >
          Explore Features
        </Link>
        <span className="text-white/20">·</span>
        <Link
          href="/support"
          className="text-neutral-400 hover:text-white transition-colors duration-200"
        >
          Support & Help
        </Link>
        <span className="text-white/20">·</span>
        <Link
          href="/signin"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-200"
        >
          Get Started Now
        </Link>
      </div>
    </ContentPageLayout>
  );
}

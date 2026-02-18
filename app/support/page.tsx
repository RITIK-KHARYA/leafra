import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/custom/ContentPageLayout";
import { HelpCircle, Wrench, MessageCircle, LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Support & Help",
  description:
    "Get help with Leafra: account setup, PDF uploads, AI chat, and troubleshooting. Find answers and contact support.",
  alternates: { canonical: "https://leafra-eight.vercel.app/support" },
};

const gettingStarted = [
  {
    q: "How do I create an account?",
    a: "Click “Sign In” and choose your preferred method — email/password or social login.",
  },
  {
    q: "What file formats are supported?",
    a: "Currently we support PDF files up to 8MB in size.",
  },
  {
    q: "How long does processing take?",
    a: "Most documents are processed within 1–2 minutes.",
  },
];

const troubleshooting = [
  {
    q: "My upload failed",
    a: "Check file size (max 8MB) and ensure it’s a valid PDF. Try refreshing the page.",
  },
  {
    q: "Answers seem inaccurate",
    a: "Try rephrasing your question or ask for specific sections or pages.",
  },
  {
    q: "Can’t access my chats",
    a: "Ensure you’re signed in and check your internet connection.",
  },
];

const faqs = [
  {
    q: "Is my data secure?",
    a: "Yes. We use industry-standard encryption and security measures to protect your documents and personal information.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. You can delete your account and all associated data from your account settings.",
  },
  {
    q: "Do you store my documents?",
    a: "Documents are securely stored to provide the best experience; you can delete them anytime.",
  },
  {
    q: "What languages are supported?",
    a: "Our AI understands multiple languages and will respond in the same language as your questions.",
  },
];

function QaBlock({
  title,
  items,
  icon: IconComponent,
  iconClass,
}: {
  title: string;
  items: { q: string; a: string }[];
  icon: LucideIcon;
  iconClass: string;
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className={`flex items-center gap-2 mb-4 ${iconClass}`}>
        <IconComponent className="w-5 h-5 shrink-0" />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.q}>
            <h3 className="text-sm font-medium text-white mb-1">{item.q}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <ContentPageLayout back={{ href: "/", label: "Back to Home" }}>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-3">
          Support Center
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Get help with Leafra and make the most of our AI-powered PDF analysis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-8">
        <QaBlock
          title="Getting Started"
          items={gettingStarted}
          icon={HelpCircle}
          iconClass="text-emerald-400"
        />
        <QaBlock
          title="Troubleshooting"
          items={troubleshooting}
          icon={Wrench}
          iconClass="text-cyan-400"
        />
      </div>

      <div className="mb-10">
        <QaBlock
          title="Frequently Asked Questions"
          items={faqs}
          icon={MessageCircle}
          iconClass="text-violet-400"
        />
      </div>

      <div className="text-center">
        <p className="text-neutral-400 text-sm mb-4">
          Still need help? We&apos;re here for you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/how-to-use"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
          >
            How-to Guide
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </ContentPageLayout>
  );
}

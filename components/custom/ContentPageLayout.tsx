"use client";

import Header from "@/components/custom/landingheader";
import Footer from "@/components/custom/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ContentPageLayoutProps = {
  children: React.ReactNode;
  /** Optional back link: { href, label } */
  back?: { href: string; label: string };
  /** Optional compact top (less padding) for dense content */
  compact?: boolean;
};

export default function ContentPageLayout({
  children,
  back,
  compact,
}: ContentPageLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-emerald-500/30">
      {/* Background: match landing */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-emerald-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main
          className={`flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 ${
            compact ? "pt-28 sm:pt-32 pb-16" : "pt-28 sm:pt-36 pb-20"
          }`}
        >
          {back && (
            <Link
              href={back.href}
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {back.label}
            </Link>
          )}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

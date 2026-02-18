import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/custom/ContentPageLayout";
import { GLOSSARY_TERMS } from "@/lib/seo/glossary-data";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Definitions of RAG, vector search, embeddings, document AI, and other terms used in Leafra's AI-powered PDF analysis platform.",
  alternates: { canonical: "https://leafra-eight.vercel.app/glossary" },
};

export default function GlossaryPage() {
  return (
    <ContentPageLayout back={{ href: "/", label: "Back to Home" }}>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-3">
          Glossary
        </h1>
        <p className="text-neutral-400">
          Key terms and concepts behind Leafra&apos;s AI PDF chat and document
          intelligence.
        </p>
      </div>

      <ul className="space-y-3">
        {GLOSSARY_TERMS.map((term) => (
          <li key={term.slug}>
            <Link
              href={`/glossary/${term.slug}`}
              className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors duration-200 group"
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-white group-hover:text-emerald-400/90 transition-colors duration-200">
                  {term.title}
                </h2>
                <p className="text-sm text-neutral-400 mt-0.5 line-clamp-2">
                  {term.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 text-neutral-500 group-hover:text-emerald-400/90 transition-colors duration-200" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-neutral-500 text-sm">
          Explore{" "}
          <Link
            href="/features"
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            Leafra&apos;s features
          </Link>{" "}
          or read our{" "}
          <Link
            href="/how-to-use"
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            how-to guide
          </Link>{" "}
          to get started.
        </p>
      </div>
    </ContentPageLayout>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_TERMS } from "@/lib/seo/glossary-data";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Definitions of RAG, vector search, embeddings, document AI, and other terms used in Leafra's AI-powered PDF analysis platform.",
  alternates: { canonical: "https://leafraa.ai/glossary" },
};

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-4">Glossary</h1>
        <p className="text-lg text-gray-300 mb-12">
          Key terms and concepts behind Leafra&apos;s AI PDF chat and document
          intelligence.
        </p>

        <ul className="space-y-4">
          {GLOSSARY_TERMS.map((term) => (
            <li key={term.slug}>
              <Link
                href={`/glossary/${term.slug}`}
                className="block p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white mb-1">
                  {term.title}
                </h2>
                <p className="text-gray-400 text-sm">{term.description}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Explore{" "}
            <Link
              href="/features"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Leafra&apos;s features
            </Link>{" "}
            or read our{" "}
            <Link
              href="/how-to-use"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              how-to guide
            </Link>{" "}
            to get started.
          </p>
        </div>
      </div>
    </main>
  );
}

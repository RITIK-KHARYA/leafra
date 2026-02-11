import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GLOSSARY_TERMS,
  getGlossaryTerm,
  getAllGlossarySlugs,
} from "@/lib/seo/glossary-data";

const baseUrl = "https://leafraa.ai";

type Props = { params: Promise<{ term: string }> };

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ term: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return { title: "Term Not Found" };
  return {
    title: term.title,
    description: term.description,
    alternates: { canonical: `${baseUrl}/glossary/${term.slug}` },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const relatedTerms = term.related
    .map((s) => getGlossaryTerm(s))
    .filter((t): t is NonNullable<typeof t> => t != null);

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.title,
    description: term.description,
    url: `${baseUrl}/glossary/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Leafra Glossary",
      url: `${baseUrl}/glossary`,
    },
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <Link
          href="/glossary"
          className="text-blue-400 hover:text-blue-300 mb-8 inline-block"
        >
          ← Back to Glossary
        </Link>

        <h1 className="text-4xl font-bold mb-6">{term.title}</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          {term.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-gray-300 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {relatedTerms.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Related terms</h2>
            <ul className="flex flex-wrap gap-3">
              {relatedTerms.map((t) =>
                t ? (
                  <li key={t.slug}>
                    <Link
                      href={`/glossary/${t.slug}`}
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {t.title}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/glossary"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View all glossary terms
          </Link>
        </div>
      </div>
    </main>
  );
}

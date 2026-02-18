import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContentPageLayout from "@/components/custom/ContentPageLayout";
import {
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
    <ContentPageLayout back={{ href: "/glossary", label: "Back to Glossary" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent mb-6">
        {term.title}
      </h1>

      <div className="space-y-5">
        {term.content.split("\n\n").map((para, i) => (
          <p key={i} className="text-neutral-400 leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {relatedTerms.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">
            Related terms
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedTerms.map((t) =>
              t ? (
                <li key={t.slug}>
                  <Link
                    href={`/glossary/${t.slug}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-neutral-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors duration-200"
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
          className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
        >
          View all glossary terms
        </Link>
      </div>
    </ContentPageLayout>
  );
}

const baseUrl = "https://leafraa.ai";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Leafra",
  url: baseUrl,
  description:
    "AI-powered PDF RAG system. Transform your PDF documents into intelligent knowledge bases. Ask questions, get instant AI-powered answers.",
  sameAs: ["https://x.com", "https://github.com"],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Leafra",
  url: baseUrl,
  description:
    "Transform your PDF documents into intelligent knowledge bases with Leafra's AI-powered RAG system.",
  publisher: {
    "@type": "Organization",
    name: "Leafra",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", url: `${baseUrl}/dashboard` },
    "query-input": "required name=query",
  },
};

export function RootJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
    </>
  );
}

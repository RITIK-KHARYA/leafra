export const GLOSSARY_TERMS = [
  {
    slug: "rag",
    title: "RAG (Retrieval-Augmented Generation)",
    description:
      "RAG is a technique that combines retrieval of relevant documents with generative AI to produce accurate, context-aware answers.",
    content: `RAG (Retrieval-Augmented Generation) enhances large language models by first retrieving relevant information from a knowledge base—such as your PDF documents—and then using that context to generate answers. Instead of relying only on the model's training data, RAG grounds responses in your actual documents, reducing hallucinations and improving accuracy.

Leafra uses RAG to power its PDF chat: when you ask a question, the system finds the most relevant passages from your uploaded PDFs and feeds them to the AI, so answers are based on your content.`,
    related: ["vector-search", "embedding", "document-ai"],
  },
  {
    slug: "vector-search",
    title: "Vector Search",
    description:
      "Vector search finds similar content by comparing numerical representations (embeddings) of text, enabling semantic search.",
    content: `Vector search—also called semantic or similarity search—works by converting text into high-dimensional vectors (embeddings) and then finding items whose vectors are closest to your query vector. Unlike keyword search, it understands meaning: a query like "pricing plans" can match content that says "subscription costs" or "payment options."

Leafra uses vector search (via Pinecone) to quickly retrieve the most relevant sections of your PDFs when you ask a question, so the AI gets the right context every time.`,
    related: ["embedding", "rag", "semantic-search"],
  },
  {
    slug: "embedding",
    title: "Embedding",
    description:
      "An embedding is a numerical vector that represents the meaning of text, used for similarity search and RAG.",
    content: `An embedding is a list of numbers that captures the semantic meaning of a piece of text. Similar concepts get similar embeddings, so the model can compare them mathematically (e.g., with cosine similarity) to find relevant content. Embeddings are produced by embedding models (e.g., from OpenAI or open-source alternatives) and stored in a vector database.

In Leafra, every chunk of your PDF is turned into an embedding and stored; when you ask a question, your question is embedded too, and the system retrieves the chunks whose embeddings are closest to it.`,
    related: ["vector-search", "rag", "document-ai"],
  },
  {
    slug: "pdf",
    title: "PDF (Portable Document Format)",
    description:
      "PDF is a file format for documents that preserves layout and is widely used for reports, manuals, and forms.",
    content: `PDF (Portable Document Format) is a standard for representing documents in a way that looks the same across devices and platforms. PDFs can contain text, images, and structure (headings, tables), but extracting and querying that content programmatically has traditionally been hard.

Leafra parses your PDFs, extracts text and structure, and turns the content into a searchable knowledge base so you can ask questions and get AI-powered answers directly from your documents.`,
    related: ["document-ai", "rag"],
  },
  {
    slug: "document-ai",
    title: "Document AI",
    description:
      "Document AI refers to using artificial intelligence to understand, extract, and reason over document content.",
    content: `Document AI applies machine learning and natural language processing to documents—PDFs, contracts, reports, manuals—to extract information, answer questions, summarize content, and support decision-making. It goes beyond simple OCR by understanding context, relationships, and intent.

Leafra is a document AI platform focused on PDFs: upload your files, and use chat and vector search to get instant, accurate answers grounded in your documents.`,
    related: ["rag", "vector-search", "pdf"],
  },
  {
    slug: "semantic-search",
    title: "Semantic Search",
    description:
      "Semantic search finds content by meaning rather than exact keywords, using embeddings and vector similarity.",
    content: `Semantic search retrieves information based on the meaning of your query, not just matching keywords. It uses embeddings and vector similarity so that "how do I cancel?" can match content about "subscription cancellation" or "ending your plan."

Leafra uses semantic search under the hood to pull the right parts of your PDFs for each question, so you get relevant answers even when the wording doesn't match exactly.`,
    related: ["vector-search", "embedding", "rag"],
  },
] as const;

export type GlossaryTermSlug = (typeof GLOSSARY_TERMS)[number]["slug"];

export function getGlossaryTerm(slug: string) {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return GLOSSARY_TERMS.map((t) => t.slug);
}

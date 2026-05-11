import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TaskType } from "@google/generative-ai";

import { embedText } from "@/lib/embeddings";
import { getPineconeClient } from "@/lib/integrations/pinecone";
import { logger } from "@/lib/logger";

interface Vector {
  id: string;
  values: number[];
  metadata: {
    pageNumber: number;
    content: string;
  };
}

type ProcessUploadedPdfArgs = {
  chatId: string;
  fileUrl: string;
  source: "worker" | "inline";
  jobId?: string;
};

export async function processUploadedPdf({
  chatId,
  fileUrl,
  source,
  jobId,
}: ProcessUploadedPdfArgs): Promise<void> {
  const pinecone = getPineconeClient();
  const pineconeIndex = pinecone.index("leafravectordb");

  logger.info("Starting PDF embedding", {
    chatId,
    fileUrl,
    source,
    jobId,
  });

  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF: ${response.status} ${response.statusText}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const blob = new Blob([new Uint8Array(buffer)], {
    type: "application/pdf",
  });

  const loader = new WebPDFLoader(blob, { splitPages: true });
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments(rawDocs);

  logger.debug("PDF split into chunks", {
    totalChunks: docs.length,
    chatId,
    source,
    jobId,
  });

  const docsWithVectors = await Promise.all(
    docs.map(async (doc, idx) => {
      const pageNumber = Number(doc.metadata?.loc?.pageNumber ?? 0);
      const content = doc.pageContent.replace(/\n/g, "");
      return {
        id: `${fileUrl}-${pageNumber}-${idx}`,
        values: await embedText(content, TaskType.RETRIEVAL_DOCUMENT),
        metadata: {
          pageNumber,
          content,
        },
      } satisfies Vector;
    }),
  );

  const namespace = pineconeIndex.namespace(chatId);
  await namespace.upsert(docsWithVectors);

  logger.info("PDF embedded and stored in Pinecone", {
    chatId,
    fileUrl,
    source,
    jobId,
    vectorCount: docsWithVectors.length,
  });
}

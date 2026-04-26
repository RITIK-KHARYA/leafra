"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadButton } from "../utils/uploadthing";
import { getFile } from "@/app/actions/file/get";
import { Upload, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "./ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const pageWidth = containerWidth > 0 ? containerWidth - 32 : undefined;

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/80 shrink-0">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-zinc-400 min-w-[60px] text-center">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : "..."}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-zinc-400 min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white"
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
            disabled={scale >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex justify-center p-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error("PDF load error:", error);
            toast.error("Failed to load PDF");
            setLoading(false);
          }}
          loading={null}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            width={pageWidth}
            loading={
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}

export default function ExampleUpload({ chatId }: { chatId: string }) {
  const [pdfurl, setpdfurl] = useState<string | null>(null);
  useEffect(() => {
    const getdata = async () => {
      const res = await getFile(chatId.toString());
      if (res.data?.pdfUrl) {
        setpdfurl(res.data.pdfUrl);
      }
    };
    getdata();
  }, [chatId]);

  return (
    <main className="flex h-full flex-col items-center justify-between">
      {pdfurl ? (
        <PdfViewer url={`/api/pdf?url=${encodeURIComponent(pdfurl)}`} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <Upload className="h-8 w-8 text-white" />
          <div className="p-4 text-zinc-400">upload a pdf file</div>
          <UploadButton
            className="bg-neutral-900 text-white"
            appearance={{
              allowedContent: "hidden",
              button: "data-[state=ready]:bg-neutral-700/60 p-2 text-white",
            }}
            // @ts-expect-error - input prop exists at runtime but not in generated types
            input={{ chatId }}
            endpoint="pdfUploader"
            onClientUploadComplete={async (res) => {
              toast.success("Files uploaded successfully");
              const uploadUrl = res?.[0]?.url;
              if (uploadUrl) {
                setpdfurl(uploadUrl);
              }
              try {
                await new Promise((resolve) => setTimeout(resolve, 800));
                const fileData = await getFile(chatId);
                if (fileData.data?.pdfUrl) {
                  setpdfurl(fileData.data.pdfUrl);
                } else if (!uploadUrl) {
                  toast.warning("File uploaded but preview not available");
                }
              } catch (error) {
                console.error("Error fetching file after upload:", error);
                if (!uploadUrl) {
                  toast.error("Failed to load file preview");
                }
              }
            }}
            onUploadBegin={(res) => {
              console.log("upload begin", res);
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error);
              toast.error(`Upload failed: ${error.message}`);
            }}
          />
        </div>
      )}
    </main>
  );
}

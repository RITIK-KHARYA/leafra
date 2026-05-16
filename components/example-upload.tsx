"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadButton } from "../utils/uploadthing";
import { getFile } from "@/app/actions/file/get";
import { Loader2, Upload } from "lucide-react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
    </div>
  ),
});

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

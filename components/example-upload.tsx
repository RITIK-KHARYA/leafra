"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadButton } from "../utils/uploadthing";
import { getFile } from "@/app/actions/file/get";
import { Upload } from "lucide-react";

export default function ExampleUpload({ chatId }: { chatId: string }) {
  const [pdfurl, setpdfurl] = useState<string | null>(null);
  useEffect(() => {
    const getdata = async () => {
      console.log("useEffect running, chatId:", chatId);
      const res = await getFile(chatId.toString());
      console.log("working", res);
      if (res.data?.pdfUrl) {
        setpdfurl(res.data.pdfUrl);
      }
    };
    getdata();
  }, [chatId]);

  return (
    <main className="flex h-full flex-col items-center justify-between space-y-4">
      {pdfurl ? (
        <div className="w-full h-full flex justify-center">
          <iframe
            src={pdfurl}
            title="Uploaded PDF"
            className="w-full h-screen border rounded shadow-lg bg-white"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <Upload className="h-8 w-8 text-white" />
          <div className="p-4">upload a pdf file</div>
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
              console.log("Files: ", res);

              // Refetch from database after upload to get the correct URL
              try {
                // Wait a bit for server to update DB
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const fileData = await getFile(chatId);
                if (fileData.data?.pdfUrl) {
                  setpdfurl(fileData.data.pdfUrl);
                } else if (res && res[0]?.url) {
                  // Fallback to upload response URL
                  setpdfurl(res[0].url);
                } else {
                  toast.warning("File uploaded but preview not available");
                }
              } catch (error) {
                console.error("Error fetching file after upload:", error);
                if (res && res[0]?.url) {
                  setpdfurl(res[0].url);
                } else {
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

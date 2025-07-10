"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import ExampleUpload from "../example-upload";
import { ParamValue } from "next/dist/server/request/params";

export default function PdfUpload({ chatId }: { chatId: string }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex min-h-full min-w-full flex-col bg-neutral-950 items-center justify-center">
      <div
        className={`text-center cursor-pointer w-full`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Upload Icon */}

          <div className="w-full h-full">
            <ExampleUpload chatId={chatId} />
          </div>
        </div>
      </div>
    </div>
  );
}

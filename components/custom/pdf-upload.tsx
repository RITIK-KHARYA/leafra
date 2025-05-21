"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function PdfUpload() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`border-2 border-dashed ${
        isDragging ? "border-zinc-600 bg-zinc-900/50" : "border-zinc-800"
      } p-8 text-center`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        // Handle file drop logic here
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-zinc-800">
          <Upload className="h-8 w-8 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Upload your PDF</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Drag and drop or click to browse
          </p>
        </div>
        <Button className="rounded-none bg-zinc-800 hover:bg-zinc-700">
          Select PDF
        </Button>
      </div>
    </div>
  );
}

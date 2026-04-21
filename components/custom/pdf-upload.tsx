"use client";

import ExampleUpload from "../example-upload";

export default function PdfUpload({ chatId }: { chatId: string }) {
  return (
    <div className="flex min-h-full min-w-full flex-col bg-neutral-950 items-center justify-center">
      <div
        className={`text-center cursor-pointer w-full`}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
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

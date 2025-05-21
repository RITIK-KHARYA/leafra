import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export default function PdfViewer() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-zinc-800">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="rounded-none h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">Page 1 of 12</span>
          <Button variant="ghost" size="icon" className="rounded-none h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="rounded-none h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">100%</span>
          <Button variant="ghost" size="icon" className="rounded-none h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-zinc-950">
        <div className="w-full max-w-md aspect-[3/4] bg-white text-black p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold">Research Paper</h2>
            <p className="text-sm text-zinc-600">
              The Impact of AI on Knowledge Work
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

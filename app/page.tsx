"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, Send, Trash2 } from "lucide-react";
import ChatMessage from "@/components/custom/chat-message";
import PdfViewer from "@/components/custom/pdf-viewer";
import PdfUpload from "@/components/custom/pdf-upload";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col h-screen w-screen bg-black text-white">
      <header className="border-b border-zinc-800 p-4">
        <div className="container flex items-center justify-between">
          <div className="flex gap-4">
            <Image
              src={"/mainlogo.png"}
              alt="logo"
              className="object-center"
              about="logo"
              width={40}
              height={40}
              onClick={() => router.push("/")}
            />
            <h1 className="text-xl font-semibold tracking-wide flex items-center">
              Leafra.ai
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-none border-zinc-800 text-zinc-400 bg-black hover:text-white hover:bg-zinc-900"
          >
            <MessageSquare className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </header>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-zinc-900 mb-4">
              <TabsTrigger
                value="chat"
                className="rounded-none data-[state=active]:bg-zinc-800 text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="rounded-none data-[state=active]:bg-zinc-800 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="chat"
              className="flex-1 flex flex-col space-y-4 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {/* 
              chat message here
               */}
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <form className="flex items-center gap-2">
                  <Input
                    placeholder="Ask a question about your PDF..."
                    className="rounded-none bg-zinc-900 border-zinc-800 focus-visible:ring-zinc-700"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-none bg-zinc-800 hover:bg-zinc-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="files" className="flex-1 overflow-hidden">
              <PdfUpload />

              <div className="mt-4 border border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-zinc-400" />
                    <span className="text-sm">research-paper.pdf</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block w-1/2 border border-zinc-800 bg-zinc-900">
          <PdfViewer />
        </div>
      </div>
    </main>
  );
}

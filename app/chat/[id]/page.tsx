"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText } from "lucide-react";
import PdfViewer from "@/components/custom/pdf-viewer";
import PdfUpload from "@/components/custom/pdf-upload";
import Header from "@/components/custom/Header";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const { handleInputChange, handleSubmit, messages, input } = useChat({
    api: "api/chat",
  });

  return (
    <main className="flex flex-col h-screen bg-black text-white">
      <header className="border-b border-zinc-800 p-4 inline-flex items-center justify-between">
        <Header />
        <Button
          // onClick={() => {}}
          variant="outline"
          className="rounded-none border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </header>

      <div className="flex gap-4 p-4 overflow-hidden h-full">
        {/* Left: Chat and Files Tabs */}
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-zinc-900 mb-4">
              <TabsTrigger
                value="chat"
                className="rounded-none data-[state=active]:bg-zinc-800"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="rounded-none data-[state=active]:bg-zinc-800"
              >
                <FileText className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="chat"
              className="flex-1 flex flex-col space-y-4 overflow-hidden"
            >
              {/* Render chat messages here */}
              {/* <MessageComponent /> */}

              {/* Render chat input here */}
              {/* <ChatInput /> */}

              <form
                onSubmit={handleSubmit}
                onChange={() => handleInputChange}
                className="flex flex-col space-y-4 bottom-0"
              ></form>
            </TabsContent>

            <TabsContent value="files" className="flex-1 overflow-hidden">
              <PdfUpload />
              {/* Render uploaded file list here if needed */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: PDF Viewer */}
        <div className="hidden lg:block w-1/2 border border-zinc-800 bg-zinc-900">
          <PdfViewer />
        </div>
      </div>
    </main>
  );
}

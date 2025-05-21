import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, Send, Trash2 } from "lucide-react";
import ChatMessage from "@/components/custom/chat-message";
import PdfViewer from "@/components/custom/pdf-viewer";
import PdfUpload from "@/components/custom/pdf-upload";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen bg-black text-white">
      <header className="border-b border-zinc-800 p-4">
        <div className="container flex items-center justify-between">
          <div
            className="flex gap-2x`"
          >
            <Image
              src={"/Leafra.png"}
              alt="logo"
              className=""
              width={50}
              height={50}
            />
            <h1 className="text-xl font-semibold tracking-wide">Leafra.ai</h1>
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
                <ChatMessage
                  role="assistant"
                  content="Hello! I'm your PDF assistant. Upload a PDF and I'll help you analyze and answer questions about it."
                />
                <ChatMessage
                  role="user"
                  content="Can you summarize the main points of this research paper?"
                />
                <ChatMessage
                  role="assistant"
                  content="Based on the uploaded research paper, the main points are:

1. The study examines the impact of artificial intelligence on knowledge work.
2. Results indicate a 40% increase in productivity when AI tools are properly integrated.
3. Challenges include training requirements and potential bias in AI-generated content.
4. The authors recommend a hybrid approach that combines human expertise with AI capabilities."
                />
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

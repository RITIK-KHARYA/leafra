"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, Send } from "lucide-react";
import PdfViewer from "@/components/custom/pdf-viewer";
import PdfUpload from "@/components/custom/pdf-upload";
import Header from "@/components/custom/Header";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import MessageList from "@/components/event/MessageList";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { chatId: number };

export default function ChatPage() {
  const chatId = useParams().id;
  const [data, setData] = useState([]);

  useEffect(() => {
    const getdata = async () => {
      const res = await fetch(`/api/messages?chatId=${chatId}`);
      const data = await res.json();
      setData(data);
    };
    getdata();
  }, [chatId]);
  const { handleInputChange, handleSubmit, messages, input } = useChat({
    body: {
      chatId: chatId,
    },
    initialMessages: data || [],
  });
  console.log(messages);

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
              className="w-full flex flex-col flex-1 overflow-hidden"
            >
              {/* Render chat messages here */}
              <div className="flex-1 overflow-auto">
                <MessageList messages={messages} isLoading={false} />
              </div>

              {/* Render chat input here */}
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-row items-center"
              >
                <Input
                  value={input}
                  className="flex-1 w-full text-neutral-300 text-sm font-normal whitespace-pre-line rounded-md flex items-center"
                  onChange={handleInputChange}
                  placeholder="ask me something ..."
                />
                <Button className="rounded-sm  border-zinc-800 bg-neutral-900  text-zinc-400 hover:text-white hover:bg-neutral-900">
                  <Send />
                </Button>
              </form>
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

"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, Send, Home } from "lucide-react";
import PdfViewer from "@/components/custom/pdf-viewer";
import PdfUpload from "@/components/custom/pdf-upload";
import Header from "@/components/custom/Header";
import { Chat, UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Input } from "@/components/ui/input";
import MessageList from "@/components/event/MessageList";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

// Database message type
type DbMessage = {
  id: number;
  chatId: string;
  content: string;
  role: "user" | "system";
  createdAt: Date;
};

// API response type
type ApiResponse<T> = {
  data: T;
  message?: string;
  statusCode: number;
};

export default function ChatPage() {
  const chatId = useParams().id as string;
  const router = useRouter();
  const [dbMessages, setDbMessages] = useState<DbMessage[]>([]);
  const [input, setInput] = useState("");

  // Transform database messages to UIMessage format
  const initialMessages = useMemo<UIMessage[]>(() => {
    return dbMessages.map((msg) => ({
      id: msg.id.toString(),
      role: msg.role === "system" ? "assistant" : "user",
      parts: [
        {
          type: "text" as const,
          text: msg.content,
        },
      ],
    }));
  }, [dbMessages]);

  // Fetch messages from database
  useEffect(() => {
    const getdata = async () => {
      try {
        const res = await fetch(`/api/messages?chatId=${chatId}`);
        const response: ApiResponse<DbMessage[]> = await res.json();
        if (response.data) {
          setDbMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (chatId) {
      getdata();
    }
  }, [chatId]);

  // Initialize Chat and useChat hook
  const { messages, status, sendMessage, error } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        chatId: chatId,
      },
    }),
    messages: initialMessages,
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming" || status === "submitted") {
      return;
    }

    const messageToSend = input.trim();
    setInput("");
    await sendMessage({ text: messageToSend });
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white">
      <header className="border-b border-zinc-800  inline-flex items-center justify-between">
        <Header />
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
          variant="outline"
          className="rounded-none border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          <Home className="h-4 w-4 mr-2 text-zinc-400" />
          Dashboard
        </Button>
      </header>

      <div className="flex gap-4 p-3 overflow-hidden h-full">
        {/* Left: Chat and Files Tabs */}
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-zinc-900 mb-4">
              <TabsTrigger
                value="chat"
                className="rounded-none data-[state=active]:bg-zinc-800"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="rounded-none data-[state=active]:bg-zinc-800"
              >
                <FileText className="h-4 w-4 " />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="chat"
              className="w-full flex flex-col flex-1 overflow-hidden"
            >
              {/* Render chat messages here */}
              <div className="flex-1 overflow-auto">
                <MessageList
                  messages={messages}
                  isLoading={status === "streaming" || status === "submitted"}
                />
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
                <Button className="rounded-sm ml-2  border-zinc-800 bg-neutral-900  text-zinc-400 hover:text-white hover:bg-neutral-900">
                  <Send />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="files" className="flex-1 overflow-hidden">
              {/* 
              here we will have another chat section for the quiz */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: PDF Viewer */}
        <div className="hidden lg:block w-1/2 border border-zinc-800 bg-zinc-900">
          <PdfUpload chatId={chatId} />
        </div>
      </div>
    </main>
  );
}

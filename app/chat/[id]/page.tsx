"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, Send, Home } from "lucide-react";
import PdfViewer from "@/components/custom/pdf-viewer";
import PdfUpload from "@/components/custom/pdf-upload";
import Header from "@/components/custom/Header";
import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Input } from "@/components/ui/input";
import MessageList from "@/components/event/MessageList";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, Suspense, useRef } from "react";
import { toast } from "sonner";
import { DbMessage, ApiResponse } from "../types";

function ChatPageContent() {
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
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?chatId=${chatId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch messages: ${res.statusText}`);
      }
      const response: ApiResponse<DbMessage[]> = await res.json();
      if (response.data) {
        setDbMessages(response.data);
      } else if (response.statusCode !== 200) {
        toast.error("Failed to load messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load chat messages. Please refresh the page.");
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Initialize useChat hook
  const {
    messages,
    status,
    sendMessage,
    error,
    regenerate,
    setMessages,
    resumeStream,
    stop,
  } = useChat<UIMessage>({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        chatId: chatId,
      },
    }),
    messages: initialMessages || [],
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
    },
  });

  // Sync useChat messages with DB messages when they're loaded
  useEffect(() => {
    if (initialMessages.length > 0) {
      // Only sync if useChat messages are empty or different
      const currentMessageIds = new Set(messages.map((m) => m.id));
      const dbMessageIds = new Set(initialMessages.map((m) => m.id));

      // Check if we need to sync (DB has messages that useChat doesn't have)
      const needsSync = initialMessages.some(
        (msg) => !currentMessageIds.has(msg.id)
      );

      if (needsSync || (messages.length === 0 && initialMessages.length > 0)) {
        setMessages(initialMessages);
      }
    }
  }, [initialMessages, setMessages, messages]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Track previous status to detect when stream completes
  const prevStatusRef = useRef(status);

  // Refresh messages after stream completes
  useEffect(() => {
    // Only refresh when status changes from streaming/submitted to ready
    const wasStreaming =
      prevStatusRef.current === "streaming" ||
      prevStatusRef.current === "submitted";
    const isNowReady = status !== "streaming" && status !== "submitted";

    if (wasStreaming && isNowReady && messages.length > 0) {
      // Small delay to ensure DB has been updated
      const timeoutId = setTimeout(() => {
        fetchMessages();
      }, 500);
      prevStatusRef.current = status;
      return () => clearTimeout(timeoutId);
    }
    prevStatusRef.current = status;
  }, [status, messages.length, chatId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming" || status === "submitted") {
      return;
    }

    const messageToSend = input.trim();
    setInput("");
    await sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: messageToSend,
        },
      ],
    });
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white">
      <header className="border-b border-zinc-800 inline-flex items-center justify-between w-full">
        <Header />
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
          variant="outline"
          className="rounded-none border-zinc-800 text-white hover:text-zinc-400 hover:bg-zinc-900"
        >
          <Home className="h-4 w-4 mr-2 text-zinc-400" />
          Dashboard
        </Button>
      </header>

      <div className="flex gap-4 p-3 overflow-hidden h-full">
        {/* Left:  Chat and Files Tabs */}
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
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="chat"
              className="w-full flex flex-col flex-1 overflow-hidden"
            >
              {/* Messages Container */}
              <div className="flex-1 overflow-auto">
                <MessageList
                  messages={messages}
                  isLoading={status === "streaming" || status === "submitted"}
                />
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-row items-center gap-2 border-t border-zinc-800 pt-3"
              >
                <Input
                  value={input}
                  className="flex-1 text-neutral-300 text-sm font-normal rounded-md"
                  onChange={handleInputChange}
                  placeholder="ask me something ..."
                  disabled={status === "streaming" || status === "submitted"}
                />
                <Button
                  type="submit"
                  className="rounded-sm bg-neutral-900 text-zinc-400 hover:text-white hover:bg-neutral-800 border border-zinc-800"
                  disabled={
                    status === "streaming" ||
                    status === "submitted" ||
                    !input.trim()
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="files" className="flex-1 overflow-hidden">
              {/* Quiz section - to be implemented */}
              <div className="flex items-center justify-center h-full text-zinc-500">
                Quiz section coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: PDF Viewer */}
        <div className="hidden lg:block w-1/2 border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
          <PdfUpload chatId={chatId} />
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}

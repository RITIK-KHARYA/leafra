"use client";

import { ArrowRight, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { priorityEmojis } from "./custom/newChatbtn";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteChat } from "@/app/actions/chat/delete";

interface DarkCardProps {
  title?: string;
  description?: string;
  value: string;
  onClick?: () => void;
  href?: string;
}

export default function Chatcard({
  title,
  description,
  href,
  value,
  onClick,
}: DarkCardProps) {
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!href) return;
    if (!window.confirm("Delete this chat? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await deleteChat(href);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Chat deleted");
        await queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    } catch {
      toast.error("Failed to delete chat");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-neutral-900 flex items-center justify-center">
      <Card
        className="bg-neutral-900 border-neutral-600 max-w-sm w-full cursor-pointer transition-all duration-300 ease-in-out flex flex-col h-52 group hover:bg-neutral-750 hover:border-neutral-500 hover:shadow-xl hover:shadow-neutral-900/30 hover:-translate-y-1 relative"
        onClick={onClick}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete chat"
          className="absolute top-2 right-2 z-10 h-7 w-7 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
        <Link href={`/chat/${href}`}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex-1 pr-4">
              <h2 className="text-neutral-200 text-base font-semibold group-hover:text-white transition-colors duration-300">
                {title}
              </h2>
            </div>
            <div className="shrink-0">
              <div className="w-12 h-12 bg-neutral-700 border border-neutral-600 rounded-md overflow-hidden transition-colors duration-300 group-hover:border-neutral-500">
                {value ? (
                  <div className="flex items-center justify-center w-full h-full hover:scale-110 transition-all duration-300 ease-in-out">
                    {priorityEmojis.find((p) => p.value === value)?.emoji}
                  </div>
                ) : (
                  <Skeleton className="w-full h-full animate-pulse" />
                )}
              </div>
            </div>
          </CardHeader>

          <div className="flex-1"></div>

          <CardContent className="space-y-4 pt-8">
            <div>
              <p className="text-neutral-400 text-xs leading-relaxed transition-colors duration-300 group-hover:text-neutral-300">
                {description}
              </p>
            </div>

            <div className="flex justify-end">
              <div className="w-7 h-7 bg-transparent border border-neutral-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-neutral-400">
                <ArrowRight className="w-3 h-3 text-neutral-400 transition-all duration-300 group-hover:text-neutral-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}

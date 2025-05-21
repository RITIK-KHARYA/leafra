import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border border-zinc-800",
        role === "user" ? "bg-zinc-900" : "bg-black"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 text-xs",
          role === "user" ? "bg-zinc-700" : "bg-zinc-800"
        )}
      >
        {role === "user" ? "U" : "AI"}
      </div>
      <div className="flex-1 text-sm whitespace-pre-wrap">{content}</div>
    </div>
  );
}
    
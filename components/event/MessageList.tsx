import { cn } from "@/lib/utils";
import { UIMessage } from "@ai-sdk/react";

type Props = {
  isLoading: boolean;
  messages: UIMessage[];
};

// Helper function to extract text content from UIMessage parts
const getMessageContent = (message: UIMessage): string => {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("");
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (!messages || messages.length === 0) {
    if (isLoading) {
      return (
        <div className="flex justify-start pr-10 px-4 pt-2">
          <TypingIndicator />
        </div>
      );
    }
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => {
        const content = getMessageContent(message);
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant" || message.role === "system",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": message.role === "user",
                }
              )}
            >
              <p>{content}</p>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-start pr-10">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
};

function TypingIndicator() {
  return (
    <div className="rounded-lg px-4 py-2 shadow-md ring-1 ring-gray-900/10">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default MessageList;

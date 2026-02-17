"use client";

import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { priorityEmojis } from "./custom/newChatbtn";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

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
  return (
    <div className="bg-neutral-900 flex items-center justify-center">
      <Card
        className="bg-neutral-900 border-neutral-600 max-w-sm w-full cursor-pointer transition-all duration-300 ease-in-out flex flex-col h-52 group hover:bg-neutral-750 hover:border-neutral-500 hover:shadow-xl hover:shadow-neutral-900/30 hover:-translate-y-1"
        onClick={onClick}
      >
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

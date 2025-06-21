"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { MessageCircle, Plus, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { newchatschema } from "@/app/types/newchatschema";
import { newChat } from "@/app/actions/newchat";
import { getSession, useSession } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

export const priorityEmojis = [
  { emoji: "🔥", label: "High Priority", value: "high" },
  { emoji: "⚡", label: "Medium Priority", value: "medium" },
  { emoji: "🌱", label: "Low Priority", value: "low" },
  { emoji: "💎", label: "Premium", value: "premium" },
  { emoji: "⭐", label: "Important", value: "important" },
];

const workSections = [
  "Student",
  "Office",
  "Remote Work",
  "Freelancer",
  "Team Lead",
  "Developer",
  "Designer",
  "Marketing",
  "Sales",
  "Support",
  "Personal",
  "Other",
];

export function Newchatform() {
  const user = useSession();
  const form = useForm<z.infer<typeof newchatschema>>({
    resolver: zodResolver(newchatschema),
    defaultValues: {
      chatName: "",
      description: "",
      priority: "",
      workSection: "",
      userid: user?.data?.user,
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  async function onSubmit(data: z.infer<typeof newchatschema>) {
    try {
      setLoading(true);
      await newChat(data);
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-black flex items-center justify-center p-2">
      <Card className="w-full max-w-lg bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className=""></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="chatName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter chat name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Describe the purpose of this chat..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-5 gap-2">
                        {priorityEmojis.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => field.onChange(item.value)}
                            className={`relative p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
                              field.value === item.value
                                ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                                : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                            }`}
                          >
                            <span className="text-xl">{item.emoji}</span>
                            {field.value === item.value && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Selected:{" "}
                      {priorityEmojis.find((p) => p.value === field.value)
                        ?.label || "None"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workSection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Section</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your work section..." />
                        </SelectTrigger>
                        <SelectContent>
                          {workSections.map((section) => (
                            <SelectItem
                              key={section}
                              value={section.toLowerCase()}
                            >
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium transition-colors text-sm"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Creating Chat...
                  </div>
                ) : (
                  "Create Chat Workspace"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewChatBtn() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="rounded-sm bg-neutral-800 w-28 h-10"
        >
          New
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Chat</SheetTitle>
        </SheetHeader>
        <SheetDescription className="overflow-y-auto p-2" asChild>
          <Newchatform />
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { newChatSchema } from "@/types/chat";
import { createChat } from "@/app/actions/chat/create";
import { useSession } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle,
  Plus,
  Loader2,
  Sparkles,
  Settings,
  Zap,
} from "lucide-react";

export const priorityEmojis = [
  { emoji: "🔥", label: "High Priority", value: "high" },
  { emoji: "⚡", label: "Medium Priority", value: "medium" },
  { emoji: "🌱", label: "Low Priority", value: "low" },
  { emoji: "💎", label: "Premium", value: "premium" },
  { emoji: "⭐", label: "Important", value: "important" },
];

const workSections = [
  { value: "student", label: "Student", icon: "🎓" },
  { value: "office", label: "Office", icon: "🏢" },
  { value: "remote", label: "Remote Work", icon: "🏠" },
  { value: "freelancer", label: "Freelancer", icon: "💼" },
  { value: "team-lead", label: "Team Lead", icon: "👥" },
  { value: "developer", label: "Developer", icon: "💻" },
  { value: "designer", label: "Designer", icon: "🎨" },
  { value: "marketing", label: "Marketing", icon: "📈" },
  { value: "sales", label: "Sales", icon: "💰" },
  { value: "support", label: "Support", icon: "🎧" },
  { value: "personal", label: "Personal", icon: "👤" },
  { value: "other", label: "Other", icon: "📋" },
];

export function Newchatform() {
  const user = useSession();
  const form = useForm<z.infer<typeof newChatSchema>>({
    resolver: zodResolver(newChatSchema),
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

  async function onSubmit(data: z.infer<typeof newChatSchema>) {
    try {
      setLoading(true);
      await createChat(data);
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const selectedPriority = priorityEmojis.find(
    (p) => p.value === form.watch("priority")
  );
  const selectedWorkSection = workSections.find(
    (section) => section.value.toLowerCase() === form.watch("workSection")
  );

  return (
    <div className="bg-black min-h-full flex items-start justify-center">
      <div className="w-full max-w-lg space-y-2">
        {/* Header Section */}
        {/* <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shadow-2xl">
            <Sparkles className="w-8 h-8 text-zinc-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Create New Workspace
            </h2>
            <p className="text-zinc-400 text-sm">
              Set up your personalized AI chat environment
            </p>
          </div>
        </div> */}

        {/* Form Card */}
        <Card className="bg-zinc-950/80 border-zinc-800 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Chat Name */}
                <FormField
                  control={form.control}
                  name="chatName"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Chat Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a descriptive name for your chat..."
                          {...field}
                          className="h-12 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe the purpose and context of this chat workspace..."
                          {...field}
                          className="resize-none bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all duration-200"
                        />
                      </FormControl>
                      <FormDescription className="text-zinc-500 text-sm">
                        This helps the AI understand your specific needs and
                        provide better responses
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Priority Level */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Priority Level
                        </FormLabel>
                        {selectedPriority && (
                          <Badge
                            variant="secondary"
                            className="bg-zinc-800 text-zinc-300 border-zinc-600 px-3 py-1"
                          >
                            {selectedPriority.emoji} {selectedPriority.label}
                          </Badge>
                        )}
                      </div>
                      <FormControl>
                        <div className="grid grid-cols-5 gap-3">
                          {priorityEmojis.map((item) => (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => field.onChange(item.value)}
                              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                field.value === item.value
                                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20"
                                  : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800/50"
                              }`}
                            >
                              <span className="text-2xl block mb-1">
                                {item.emoji}
                              </span>
                              <span className="text-xs font-medium text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex  items-center justify-center">
                                {item.label.split(" ")[0]}
                              </span>
                              {field.value === item.value && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription className="text-zinc-500 text-sm">
                        {selectedPriority ? (
                          <span className="text-emerald-400">
                            Selected: {selectedPriority.label}
                          </span>
                        ) : (
                          "Choose a priority level to help organize your chats"
                        )}
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Work Section */}
                <FormField
                  control={form.control}
                  name="workSection"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-semibold text-zinc-200">
                          Work Section
                        </FormLabel>
                        {selectedWorkSection && (
                          <Badge
                            variant="outline"
                            className="bg-zinc-900 text-zinc-300 border-zinc-600 px-3 py-1"
                          >
                            {selectedWorkSection.value}
                          </Badge>
                        )}
                      </div>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 bg-zinc-900/50 border-zinc-700 text-white focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all duration-200">
                            <SelectValue
                              placeholder="Select your work context..."
                              className="text-zinc-500"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700 shadow-2xl">
                            {workSections.map((section) => (
                              <SelectItem
                                key={section.value}
                                value={section.value.toLowerCase()}
                                className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer transition-colors duration-150"
                              >
                                {section.icon} {section.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-zinc-500 text-sm">
                        This helps customize the AI's responses for your
                        specific workflow
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-white text-black hover:bg-zinc-100 font-semibold text-base transition-all duration-200 shad2ow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={form.formState.isSubmitting || loading}
                  >
                    {form.formState.isSubmitting || loading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Workspace...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span>Create Chat Workspace</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewChatBtn() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="rounded-sm bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-200 font-medium h-8 transition-all duration-200 hover:shadow-lg hover:border-zinc-600"
        >
          <Plus className="w-4 h-4 " />
          New Chat
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-black border-zinc-800 overflow-y-auto">
        <SheetHeader className="px-8 py-4 border-zinc-800 bg-zinc-950/50">
          <SheetTitle className="flex items-center gap-3 text-xl text-white">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-zinc-300" />
            </div>
            New Chat Workspace
          </SheetTitle>
          <SheetDescription className="text-zinc-400 text-base mt-2">
            Create a personalized AI chat environment tailored to your specific
            needs and workflow
          </SheetDescription>
        </SheetHeader>
        <Newchatform />
      </SheetContent>
    </Sheet>
  );
}

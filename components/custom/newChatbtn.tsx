"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  Check,
  ClipboardList,
  Diamond,
  Flame,
  Gauge,
  GraduationCap,
  Headphones,
  Laptop,
  Loader2,
  Megaphone,
  MessageCircle,
  Palette,
  PenLine,
  Plus,
  Sparkles,
  Sprout,
  Star,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { createChat } from "@/app/actions/chat/create";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { newChatSchema } from "@/types/chat";

export const priorityEmojis = [
  {
    emoji: "H",
    label: "High",
    value: "high",
    icon: Flame,
    accent: "text-rose-300",
    active: "border-rose-400/50 bg-rose-500/10 shadow-rose-950/30",
  },
  {
    emoji: "M",
    label: "Medium",
    value: "medium",
    icon: Zap,
    accent: "text-amber-300",
    active: "border-amber-400/50 bg-amber-500/10 shadow-amber-950/30",
  },
  {
    emoji: "L",
    label: "Low",
    value: "low",
    icon: Sprout,
    accent: "text-emerald-300",
    active: "border-emerald-400/50 bg-emerald-500/10 shadow-emerald-950/30",
  },
  {
    emoji: "P",
    label: "Premium",
    value: "premium",
    icon: Diamond,
    accent: "text-cyan-300",
    active: "border-cyan-400/50 bg-cyan-500/10 shadow-cyan-950/30",
  },
  {
    emoji: "I",
    label: "Important",
    value: "important",
    icon: Star,
    accent: "text-violet-300",
    active: "border-violet-400/50 bg-violet-500/10 shadow-violet-950/30",
  },
];

const workSections: {
  value: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "office", label: "Office", icon: BriefcaseBusiness },
  { value: "remote", label: "Remote Work", icon: Laptop },
  { value: "freelancer", label: "Freelancer", icon: PenLine },
  { value: "team-lead", label: "Team Lead", icon: Gauge },
  { value: "developer", label: "Developer", icon: Laptop },
  { value: "designer", label: "Designer", icon: Palette },
  { value: "marketing", label: "Marketing", icon: Megaphone },
  { value: "sales", label: "Sales", icon: Sparkles },
  { value: "support", label: "Support", icon: Headphones },
  { value: "personal", label: "Personal", icon: UserRound },
  { value: "other", label: "Other", icon: ClipboardList },
];

export function Newchatform() {
  const form = useForm<z.infer<typeof newChatSchema>>({
    resolver: zodResolver(newChatSchema),
    defaultValues: {
      chatName: "",
      description: "",
      priority: undefined,
      workSection: undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function onSubmit(data: z.infer<typeof newChatSchema>) {
    try {
      setLoading(true);
      const res = await createChat(data);
      await queryClient.invalidateQueries({ queryKey: ["chats"] });

      if (res && "data" in res && res.data?.id) {
        router.push(`/chat/${res.data.id}`);
      } else if (res && "error" in res && res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create chat");
    } finally {
      setLoading(false);
    }
  }

  const selectedPriority = priorityEmojis.find(
    (p) => p.value === form.watch("priority")
  );
  const selectedWorkSection = workSections.find(
    (section) => section.value === form.watch("workSection")
  );

  return (
    <div className="min-h-full bg-neutral-950 px-5 pb-6 pt-2 text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Workspace details
                </h3>
                <p className="text-xs text-neutral-500">
                  Name it clearly, then set its focus.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="chatName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-zinc-200">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Research notes, client brief, exam prep..."
                        {...field}
                        className="h-11 rounded-lg border-zinc-800 bg-black/40 text-white placeholder:text-zinc-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-zinc-200">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Short context for this workspace..."
                        {...field}
                        className="resize-none rounded-lg border-zinc-800 bg-black/40 text-white placeholder:text-zinc-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                      <Zap className="h-4 w-4 text-emerald-300" />
                      Priority
                    </FormLabel>
                    {selectedPriority && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300">
                        {selectedPriority.label}
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <div className="grid grid-cols-5 gap-2">
                      {priorityEmojis.map((item) => {
                        const Icon = item.icon;
                        const isSelected = field.value === item.value;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => field.onChange(item.value)}
                            className={`relative flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border p-2 text-center shadow-lg transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] ${
                              isSelected
                                ? item.active
                                : "border-white/10 bg-black/30"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${item.accent}`} />
                            <span className="text-[11px] font-medium text-neutral-300">
                              {item.label}
                            </span>
                            {isSelected && (
                              <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <FormField
              control={form.control}
              name="workSection"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-semibold text-zinc-200">
                      Context
                    </FormLabel>
                    {selectedWorkSection && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300">
                        {selectedWorkSection.label}
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 rounded-lg border-zinc-800 bg-black/40 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10">
                        <SelectValue
                          placeholder="Choose a workspace context"
                          className="text-zinc-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-800 bg-zinc-950 text-white shadow-2xl">
                        {workSections.map((section) => {
                          const Icon = section.icon;

                          return (
                            <SelectItem
                              key={section.value}
                              value={section.value}
                              className="cursor-pointer text-white focus:bg-white/10"
                            >
                              <span className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-neutral-400" />
                                {section.label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-lg bg-white font-semibold text-black shadow-lg shadow-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-100 disabled:translate-y-0 disabled:opacity-50"
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting || loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating workspace
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create workspace
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function NewChatBtn() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-8 rounded-lg border-zinc-700 bg-zinc-900 text-zinc-200 transition-all duration-200 hover:border-emerald-400/30 hover:bg-zinc-800 hover:text-white hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto border-zinc-800 bg-neutral-950 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-white/10 bg-black px-6 py-5 text-left">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-neutral-400">
              New workspace
            </span>
          </div>
          <SheetTitle className="text-2xl font-semibold tracking-tight text-white">
            Create a chat workspace
          </SheetTitle>
          <SheetDescription className="mt-2 text-sm leading-6 text-zinc-400">
            Give the session a clear shape before the conversation starts.
          </SheetDescription>
        </SheetHeader>
        <Newchatform />
      </SheetContent>
    </Sheet>
  );
}

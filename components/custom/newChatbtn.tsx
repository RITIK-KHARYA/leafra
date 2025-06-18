"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Plus, Settings } from "lucide-react";

const priorityEmojis = [
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
  const [formData, setFormData] = useState({
    chatName: "",
    description: "",
    priority: "",
    workSection: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        chatName: "",
        description: "",
        priority: "",
        workSection: "",
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-2">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  Chat Created Successfully!
                </h3>
                <p className="text-zinc-400 text-sm">
                  Your new chat workspace is ready to use
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="pb-6"></CardHeader>
        <CardContent className="space-y-8">
          {/* Image Area */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-zinc-700 overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
                <Image
                  src={"/placeholder.svg?height=96&width=96"}
                  width={96}
                  height={96}
                  alt="Chat avatar"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              {/* Fancy glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Label
                  htmlFor="chatName"
                  className="text-zinc-300 text-sm font-medium"
                >
                  Chat Name
                </Label>
                <Input
                  id="chatName"
                  name="chatName"
                  type="text"
                  placeholder="Enter chat name..."
                  value={formData.chatName}
                  onChange={handleChange}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600 h-11"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-zinc-300 text-sm font-medium"
                >
                  Chat Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the purpose of this chat..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600 resize-none"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-300">
                <Settings className="w-4 h-4" />
                <h3 className="text-sm font-medium">Details</h3>
              </div>

              <div className="space-y-4 pl-6 border-l border-zinc-800">
                {/* Priority Selection */}
                <div className="space-y-3">
                  <Label className="text-zinc-300 text-sm font-medium">
                    Priority Level
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {priorityEmojis.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          handleSelectChange("priority", item.value)
                        }
                        className={`
                          relative p-3 rounded-lg border transition-all duration-200 hover:scale-105
                          ${
                            formData.priority === item.value
                              ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                              : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                          }
                        `}
                        title={item.label}
                      >
                        <span className="text-xl">{item.emoji}</span>
                        {formData.priority === item.value && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                  {formData.priority && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Selected:{" "}
                      {
                        priorityEmojis.find(
                          (p) => p.value === formData.priority
                        )?.label
                      }
                    </p>
                  )}
                </div>

                {/* Work Section */}
                <div className="space-y-3">
                  <Label className="text-zinc-300 text-sm font-medium">
                    Work Section
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("workSection", value)
                    }
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600 focus:ring-zinc-600 h-11">
                      <SelectValue placeholder="Select your work section..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {workSections.map((section) => (
                        <SelectItem
                          key={section}
                          value={section.toLowerCase()}
                          className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                        >
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium transition-colors text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Creating Chat...
                </div>
              ) : (
                "Create Chat Workspace"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
export default function NewchatBtn() {
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
        <SheetDescription className="overflow-y-auto">
          <Newchatform />
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}

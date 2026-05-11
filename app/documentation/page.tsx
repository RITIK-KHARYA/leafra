import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileUp, MessageCircle, Settings } from "lucide-react";

import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Leafra documentation overview.",
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "Getting Started",
    body: "Create a workspace, upload a PDF, and begin asking grounded questions.",
    icon: BookOpen,
  },
  {
    title: "Upload PDFs",
    body: "Document upload, processing, and file limits will be documented here.",
    icon: FileUp,
  },
  {
    title: "Ask Questions",
    body: "Guidance for prompts, citations, and follow-up questions will live here.",
    icon: MessageCircle,
  },
  {
    title: "Account",
    body: "Settings, data controls, and account management notes will be added soon.",
    icon: Settings,
  },
];

export default function DocumentationPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-neutral-950 px-3 text-white">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-neutral-900 p-1 text-white">
              <SidebarTrigger aria-label="Toggle sidebar" />
            </div>
            <span className="text-sm font-medium text-neutral-300">
              Documentation
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
        </header>

        <main className="min-h-[calc(100svh-3.5rem)] bg-neutral-950 px-4 py-8 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-emerald-300">
                Leafra Docs
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Documentation
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
                A simple starting point for Leafra guidance. The full
                documentation experience will be expanded from this layout.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.title}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-emerald-400/30 hover:bg-white/[0.05]"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-semibold">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                      {section.body}
                    </p>
                  </section>
                );
              })}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

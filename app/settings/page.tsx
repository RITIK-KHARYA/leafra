import type { Metadata } from "next";
import Link from "next/link";
import { Bell, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";

import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Settings",
  description: "Leafra account and workspace settings.",
  robots: { index: false, follow: true },
};

const settingsSections = [
  {
    title: "Profile",
    body: "Account details and identity controls will be managed here.",
    icon: UserRound,
  },
  {
    title: "Preferences",
    body: "Default workspace behavior and app preferences will be added soon.",
    icon: SlidersHorizontal,
  },
  {
    title: "Notifications",
    body: "Email and product notification controls will live in this section.",
    icon: Bell,
  },
  {
    title: "Security",
    body: "Session, account access, and data controls will be expanded later.",
    icon: ShieldCheck,
  },
];

export default function SettingsPage() {
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
              Settings
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
                Account
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Settings
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
                A basic settings layout for account and app controls. The full
                controls can be wired in once those flows are ready.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.title}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-200">
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

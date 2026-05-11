"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  Leaf,
  LifeBuoy,
  MessageCircle,
  Plus,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Newchatform } from "@/components/custom/newChatbtn";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
  ],
};

function SidebarNewChat() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Sheet>
              <SheetTrigger asChild>
                <SidebarMenuButton
                  tooltip="New Chat"
                  className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15 hover:text-white data-[active=true]:bg-emerald-500/15"
                >
                  <Plus />
                  <span>New Chat</span>
                </SidebarMenuButton>
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
                    Give the session a clear shape before the conversation
                    starts.
                  </SheetDescription>
                </SheetHeader>
                <Newchatform />
              </SheetContent>
            </Sheet>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-white/10 bg-neutral-950 text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-14 rounded-lg hover:bg-white/5 hover:text-white"
            >
              <div className="mr-1 flex aspect-square size-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                <Leaf className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-wide">
                  Leafra
                </span>
                <span className="truncate text-xs text-neutral-400">
                  PDF intelligence
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-neutral-950 px-2 py-3 text-white">
        <SidebarNewChat />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 bg-neutral-950 p-2 text-white">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import PdfUpload from "@/components/custom/pdf-upload";
import NewchatBtn from "@/components/custom/newChatbtn";
import { useQuery } from "@tanstack/react-query";
import { getChats } from "../actions/chat/get";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import Chatcard from "@/components/chats";

interface ChatProps {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  value: string;
  pdfUrl: string | null;
  description: string | null;
  pdfName: string | null;
  pdfSize: number | null;
}

export default function DashboardPage() {
  const user = useSession();
  const { data, isLoading, error } = useQuery<ChatProps[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await getChats();
      return res.data || [];
    },
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 text-white bg-neutral-900">
          <div className="inline-flex items-center gap-2">
            <div className="bg-neutral-800 rounded-md p-1 text-white hover:bg-neutral-800">
              <SidebarTrigger aria-label="sidebartrigger" />
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-white">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {/* <BreadcrumbPage>Overview</BreadcrumbPage> */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 mr-4 ">
            <NewchatBtn />
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4 bg-neutral-950 rounded-xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <div className="flex flex-row items-center justify-around gap-x-2">
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
              </div>
            ) : error ? (
              <div className="text-red-500">
                Error loading chats: {error.message}
              </div>
            ) : (
              data?.map((stat, index: number) => (
                <Chatcard
                  key={index}
                  value={stat.value}
                  href={stat.id}
                  title={stat.title}
                  description={stat.description || ""}
                  imageSrc={stat.pdfUrl || ""}
                  imageAlt={stat.pdfName || ""}
                  onClick={() => console.log("clicked")}
                />
              ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";
import { BarChart3, FileText, LayoutDashboard } from "lucide-react";
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
import { getChats } from "../actions/chat";
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
  pdfUrl: string;
  description: string;
  pdfName: string;
  pdfSize: number;
}

export default function DashboardPage() {
  const user = useSession();
  const { data, isLoading, error } = useQuery<ChatProps[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await getChats();
      return res.data;
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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
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
              data?.map((stat, index) => (
                <Chatcard
                  key={stat.id}
                  value={stat.value}
                  href={stat.id}
                  title={stat.title}
                  description={stat.description}
                  imageSrc={stat.pdfUrl}
                  imageAlt={stat.pdfName}
                  onClick={() => console.log("clicked")}
                />
              ))
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Chart placeholder
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    {
                      name: "Olivia Martin",
                      email: "olivia.martin@email.com",
                      amount: "+$1,999.00",
                    },
                    {
                      name: "Jackson Lee",
                      email: "jackson.lee@email.com",
                      amount: "+$39.00",
                    },
                    {
                      name: "Isabella Nguyen",
                      email: "isabella.nguyen@email.com",
                      amount: "+$299.00",
                    },
                    {
                      name: "William Kim",
                      email: "will@email.com",
                      amount: "+$99.00",
                    },
                  ].map((sale, index) => (
                    <div key={index} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {sale.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{sale.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <PdfUpload />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

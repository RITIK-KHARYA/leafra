"use client";
import { BarChart3, FileText, LayoutDashboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import PdfUpload from "@/components/custom/pdf-upload";
import NewchatBtn from "@/components/custom/newChatbtn";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getChats } from "../actions/chat";
import { getSession, useSession } from "@/lib/auth-client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatProps {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  pdfUrl: string;
  pdfName: string;
  pdfSize: number;
}

export default function DashboardPage() {
  const user = useSession();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await getChats(user.data.user.id);
      console.log(res, "nigga");
      setChats(res.data);
      return res;
    },
  });

  const [chat, setChats] = useState([]);
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
            {data ? (
              data.data?.map((stat) => (
                <Link href={`/dashboard/chat/${stat.id}`}>
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.title}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="flex flex-row items-center justify-around gap-x-2">
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
              </div>
            )}{" "}
            {isLoading && <div>Loading...</div>}
            {error && <div>no chats found</div>}
            {!data && !isLoading && !error && <div>no chats found</div>}
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

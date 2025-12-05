import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { unstable_noStore } from "next/cache";
import "./globals.css";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProvider,
} from "next-themes";
import UploadThingProvider from "./components/uploadthing-provider";
import ReactQueryProvider from "./providers/queryprovider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leafra",
  description: "AI Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Opt out of static optimization to allow performance.now() usage
  unstable_noStore();

  return (
    <ReactQueryProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UploadThingProvider />
            {children}
            <Toaster />
          </NextThemesProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}

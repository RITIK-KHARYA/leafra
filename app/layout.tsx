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
  description: "AI Powered PDF RAG System",
  openGraph: {
    title: "Leafra",
    siteName: "Leafra",
    url: "https://leafraa.ai",
    type: "website",
    description: "AI Powered PDF RAG System",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://leafraa.ai",
  },
  creator: "Leafra",
  publisher: "Leafra",
  category: "technology",
  keywords: ["AI", "PDF", "RAG", "System"],
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

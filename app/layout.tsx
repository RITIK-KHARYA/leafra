import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { unstable_noStore } from "next/cache";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import UploadThingProvider from "./components/uploadthing-provider";
import ReactQueryProvider from "./providers/queryprovider";
import { WebVitals } from "./components/WebVitals";
import { RootJsonLd } from "./components/JsonLd";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://leafraa.ai"),
  title: {
    default: "Leafra - AI Powered PDF RAG System",
    template: "%s | Leafra",
  },
  description:
    "Transform your PDF documents into intelligent knowledge bases. Ask questions, get instant AI-powered answers with Leafra's advanced RAG (Retrieval-Augmented Generation) system.",
  keywords: [
    "AI",
    "PDF",
    "RAG",
    "Retrieval-Augmented Generation",
    "Document AI",
    "PDF Chat",
    "Document Q&A",
    "AI Assistant",
    "PDF Analysis",
    "Vector Search",
    "Semantic Search",
    "Document Intelligence",
    "Knowledge Base",
    "AI-Powered Search",
  ],
  authors: [{ name: "Leafra" }],
  creator: "Leafra",
  publisher: "Leafra",
  applicationName: "Leafra",
  category: "technology",
  classification: "Business Software",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leafraa.ai",
    siteName: "Leafra",
    title: "Leafra - AI Powered PDF RAG System",
    description:
      "Transform your PDF documents into intelligent knowledge bases. Ask questions, get instant AI-powered answers with Leafra's advanced RAG system.",
    images: [
      {
        url: "https://leafraa.ai/og.png",
        width: 1200,
        height: 630,
        alt: "Leafra - AI Powered PDF RAG System",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leafra - AI Powered PDF RAG System",
    description:
      "Transform your PDF documents into intelligent knowledge bases. Ask questions, get instant AI-powered answers.",
    images: ["https://leafraa.ai/og.png"],
    creator: "@leafra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/og.png", sizes: "1200x630", type: "image/png" }],
  },
  manifest: "/manifest.json",
  verification: {},
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Leafra",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
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
          className={`${geistSans.variable} ${instrumentSerif.variable} ${geistMono.variable} antialiased`}
        >
          <RootJsonLd />
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UploadThingProvider />
            <WebVitals />
            {children}
            <Toaster />
          </NextThemesProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}

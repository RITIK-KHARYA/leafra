import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "Leafra chat",
  robots: { index: false, follow: true },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "Leafra chat",
  robots: { index: false, follow: true },
};

// NOTE: A server-side ownership gate here (calling `auth.api.getSession` +
// `ensureChatOwnership`) is incompatible with Next.js 16's `cacheComponents`
// pre-render: the awaited session is classified as uncached data and
// currently trips the prerender checker even when wrapped in <Suspense>.
// Ownership is still enforced server-side on every data access in:
//   - app/api/messages/route.ts
//   - app/api/chat/route.ts
//   - app/api/uploadthing/core.ts
//   - server actions under app/actions/chat/*
// so the route URL itself can only be opened while authenticated, but a
// stranger knowing a chatId will get an empty shell whose API calls 403.
// Re-add the layout-level gate once the Next.js prerender issue is resolved.
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

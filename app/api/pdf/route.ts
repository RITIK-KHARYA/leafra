import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { ApiResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return ApiResponse.unauthorized();
    }

    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return ApiResponse.badRequest("Missing url parameter");
    }

    // Only allow known hosts for PDF proxying
    const parsed = new URL(url);
    const allowed = ["utfs.io", "ufs.sh", "uploadthing.com", "w3.org"];
    if (!allowed.some((h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))) {
      return ApiResponse.badRequest("URL host not allowed");
    }

    const res = await fetch(url);
    if (!res.ok) {
      return ApiResponse.error("Failed to fetch PDF", res.status);
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    logger.error("PDF proxy error", error);
    return ApiResponse.error("Failed to proxy PDF", 500);
  }
}

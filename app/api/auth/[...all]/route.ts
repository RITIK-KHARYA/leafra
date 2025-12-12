import { toNextJsHandler } from "better-auth/next-js";

let authHandler: ReturnType<typeof toNextJsHandler> | null = null;
let authHandlerPromise: Promise<ReturnType<typeof toNextJsHandler>> | null =
  null;

async function getAuthHandler() {
  if (authHandler) {
    return authHandler;
  }

  if (authHandlerPromise) {
    return authHandlerPromise;
  }

  authHandlerPromise = (async () => {
    const { auth } = await import("@/lib/auth");
    authHandler = toNextJsHandler(auth);
    return authHandler;
  })();

  // Reset the promise after it completes (success or failure)
  // This allows retries after failures while preventing concurrent initializations
  authHandlerPromise.finally(() => {
    authHandlerPromise = null;
  });

  return authHandlerPromise;
}

export async function POST(request: Request) {
  const handler = await getAuthHandler();
  return handler.POST(request);
}

export async function GET(request: Request) {
  const handler = await getAuthHandler();
  return handler.GET(request);
}

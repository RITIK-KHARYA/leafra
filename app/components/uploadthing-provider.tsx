import { Suspense } from "react";
import { cookies } from "next/headers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../api/uploadthing/core";

async function UploadThingPlugin() {
  // Access request data before Date.now() can be used
  await cookies();
  
  // Extract router config after cookies() is accessed to avoid Date.now() error
  const routerConfig = extractRouterConfig(ourFileRouter);
  
  return <NextSSRPlugin routerConfig={routerConfig} />;
}

export default function UploadThingProvider() {
  return (
    <Suspense fallback={null}>
      <UploadThingPlugin />
    </Suspense>
  );
}


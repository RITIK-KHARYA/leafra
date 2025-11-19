import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Queue } from "bullmq";
import { UTApi } from "uploadthing/server";
import { useSonner } from "sonner";
import { updateFile } from "@/app/actions/file/update";
import z from "zod";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

// Get Redis connection details from environment variables
const getRedisConnection = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  if (!url) {
    throw new Error("UPSTASH_REDIS_REST_URL environment variable is not set");
  }

  const urlObj = new URL(url);
  return {
    host: urlObj.hostname,
    port: 6379,
    password: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
};

const queue = new Queue("upload-pdf", {
  connection: getRedisConnection(),
});

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        chatId: z.string().optional(),
      })
    )
    .middleware(async ({ req, input }) => {
      console.log("input", input);
      const user = await auth(req);
      if (!user || !input.chatId)
        throw new UploadThingError("chat-id is required");
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id, chatId: input.chatId };
    })
    .onUploadError(async ({ error, fileKey }) => {
      console.log("file", fileKey);
      console.log("Upload error for userId:", error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      console.log("pusing into queue");
      await queue.add("upload-pdf", {
        fileUrl: file.ufsUrl,
        userId: metadata.userId,
        chatId: metadata.chatId,
      });

      await updateFile(metadata.chatId, file.ufsUrl, file.name);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

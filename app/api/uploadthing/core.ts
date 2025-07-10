import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Queue } from "bullmq";
import { UTApi } from "uploadthing/server";
import { useSonner } from "sonner";
import newfile from "@/app/actions/newfile";
import z from "zod";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });
const queue = new Queue("upload-pdf", {
  connection: {
    url: "rediss://default:AdFBAAIjcDEwMmJjZmU3NDliNGE0Yjk1ODRlMDNhN2I4YTA4MzBkY3AxMA@enough-crayfish-53569.upstash.io:6379",
  },
});

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
  .input(z.object({
    chatId: z.string().optional(),
  })) 
    .middleware(async ({ req,input}) => {
      console.log("input",input);
      const user = await auth(req);
      if (!user || !input.chatId) throw new UploadThingError("chat-id is required");
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
      });

      await newfile(metadata.chatId, file.ufsUrl, file.name);

      return { uploadedBy: metadata.userId};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

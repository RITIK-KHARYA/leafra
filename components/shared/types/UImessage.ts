import { UIMessage, UITools } from "ai";
import z from "zod";

const metadataSchema = z.object({
  someMetadata: z.string().datetime(),
});

type MyMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({
  someDataPart: z.object({}),
  anotherDataPart: z.object({}),
});

type MyDataPart = z.infer<typeof dataPartSchema>;

// const tools = {
//   someTool: tool({}),
// } satisfies ToolSet;

// type MyTools = InferUITools<typeof tools>;

// export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, UITools>;

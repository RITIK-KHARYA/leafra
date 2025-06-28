import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// const embeddings = new TogetherAIEmbeddings({
//   model: "togethercomputer/m2-bert-80M-8k-retrieval", 
//   apiKey: process.env.TOGETHER_API_KEY,
// });





// const result = await embeddings.embedQuery("What is the capital of France?");


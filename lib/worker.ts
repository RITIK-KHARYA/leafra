import { Worker } from "bullmq";

console.log("hehe")

const worker = new Worker("upload-pdf", async (job) => {
  if (job.name === "upload-pdf") {
    console.log("pdf in queue heheh");
  }
},{connection:{url:"rediss://default:AdFBAAIjcDEwMmJjZmU3NDliNGE0Yjk1ODRlMDNhN2I4YTA4MzBkY3AxMA@enough-crayfish-53569.upstash.io:6379"}});

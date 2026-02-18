import type { Metadata } from "next";
import HomePage from "./components/HomePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://leafra-eight.vercel.app",
  },
};

export default function Page() {
  return <HomePage />;
}

import type { Metadata } from "next";
import HomePage from "./components/HomePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://leafraa.ai",
  },
};

export default function Page() {
  return <HomePage />;
}

import type { Metadata } from "next";
import NotFoundClient from "./components/NotFoundClient";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundClient />;
}

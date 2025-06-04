import { getSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function Session() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return null;
}

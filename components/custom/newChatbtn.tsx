import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function NewchatBtn() {
  const handleNewchat = async (e: MouseEvent) => {};

  return (
    <Sheet>
      <SheetTrigger className="bg-neutral-800 cursor-pointer text-white text-sm w-28 h-8 flex items-center justify-center group">
        New Chat
        <ArrowRight
          size={15}
          className="mx-2 transition-all duration-300 ease-in-out group-hover:translate-x-1"
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a New Chat</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}



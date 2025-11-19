"use client";

import Image from "next/image";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Thumbnail from "./thumbail";
import Footer from "./footer";
import { motion } from "framer-motion";
import Header from "./landingheader";

export default function Hero() {
  const animmateword = "Leafra";
  const text = "Welcome to ";
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Header />
      <div className="w-full h-[75%] flex flex-col ">
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="relative w-full h-screen overflow-hidden"
        >
          <Image
            src={"/heromain.webp"}
            alt="hero"
            width={1000}
            height={1000}
            className=" object-fill h-full w-full"
            // placeholder="blur"
            // blurDataURL=""
            // load the blurly image as the high quality image still loading
          />
        </motion.div>

        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex font-extralight">
          <span
            className={cn(
              "absolute inset-0 block h-[34px] w-full animate-gradient bg-gradient-to-r rounded-full from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[2px]"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          <div className="flex items-center pt-1 px-2">
            🎉 <hr className="mx-2 h-5 w-px  shrink-0 bg-neutral-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Introducing Leafra
            </AnimatedGradientText>
            <ChevronRight
              className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
            />
          </div>
        </div>
        <h1 className="text-white text-5xl z-10 absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex font-extralight">
          {text}
          <TextGenerateEffect words={animmateword} />
        </h1>
        <h3 className="text-neutral-300 text-xl z-10 absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex font-extralight">
          RAG system for the pdf reading
        </h3>
        <div className="absolute top-[50%] right-0 left-1/2 -translate-x-1/2  z-10 flex items-center justify-center">
          <Thumbnail />
        </div>
      </div>
    </div>
  );
}

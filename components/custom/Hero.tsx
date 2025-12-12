"use client";

import Image from "next/image";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Thumbnail from "./thumbail";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "./landingheader";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  const text = "Welcome to ";

  return (
    <div className="w-full">
      <div className="relative w-full h-fit flex flex-col overflow-hidden">
        {/* Header - Positioned at top */}
        <motion.div
          className="absolute top-5 left-0 right-0 z-20 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Header />
        </motion.div>

        {/* Hero Content Container */}
        <div className="relative flex-1 flex flex-col items-center justify-center pt-27">
          {/* Background Image with Parallax */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{ y, scale }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              transition={{ duration: 2.0, ease: "easeInOut", delay: 0.2 }}
              className="relative w-full h-full overflow-hidden"
            >
              <Image
                src="/heromain.webp"
                alt="AI-powered PDF analysis platform"
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
              />
              {/* Overlay gradient for better text contrast */}
              <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60" />
            </motion.div>
          </motion.div>

          {/* Animated Announcement Badge */}
          <motion.div
            className="relative z-10 mb-8"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <div className="relative flex items-center">
              <motion.span
                className={cn(
                  "absolute inset-0 block h-[38px] w-full animate-gradient bg-linear-to-r rounded-full from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-[2px]"
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="relative flex items-center px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🎉
                </motion.div>
                <hr className="mx-3 h-4 w-px shrink-0 bg-neutral-400" />
                <AnimatedGradientText className="text-sm font-medium whitespace-nowrap">
                  Introducing Leafra
                </AnimatedGradientText>
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ChevronRight className="size-4 stroke-neutral-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            className="relative z-10 text-center mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight mb-4"
              style={{ opacity }}
            >
              <span className="block text-neutral-300 text-lg sm:text-xl md:text-2xl mb-2 font-light">
                {text}
              </span>
              <motion.span
                className="bg-linear-to-r from-white via-neutral-200 to-white bg-clip-text text-transparent"
                initial={{ backgroundPosition: "200% 0" }}
                animate={{ backgroundPosition: "0% 0" }}
                transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
              >
                Leafra
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="relative z-10 text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          >
            <motion.h2
              className="text-neutral-300 text-xl sm:text-2xl md:text-3xl font-light leading-relaxed max-w-2xl mx-auto"
              style={{ opacity }}
            >
              AI-Powered RAG System for{" "}
              <motion.span
                className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2.0 }}
              >
                Intelligent PDF Analysis
              </motion.span>
            </motion.h2>
          </motion.div>

          {/* Interactive Thumbnail */}
          <div className="relative z-10">
            <Thumbnail />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => {
              const randomLeft =
                typeof window !== "undefined" ? Math.random() * 100 : 50;
              const randomTop =
                typeof window !== "undefined" ? Math.random() * 100 : 50;
              const randomDuration =
                typeof window !== "undefined" ? 3 + Math.random() * 2 : 4;
              const randomDelay =
                typeof window !== "undefined" ? Math.random() * 2 : 0;

              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${randomLeft}%`,
                    top: `${randomTop}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: randomDuration,
                    repeat: Infinity,
                    delay: randomDelay,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

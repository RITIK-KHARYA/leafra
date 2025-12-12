"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import BentoGrid from "@/components/custom/BentoGrid";
import Footer from "@/components/custom/footer";
import Hero from "@/components/custom/Hero";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="relative overflow-x-hidden">
      {/* Parallax Background Layer */}
      <motion.div
        className="fixed inset-0 -z-10 bg-linear-to-b from-neutral-950 via-neutral-900 to-black"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay pointer-events-none"
          style={{ opacity }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-neutral-950/50" />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section with Full Viewport Height */}

        <Hero />

        {/* Features Section with Scroll Animations */}
        <motion.section
          className="relative w-full py-20 md:py-28 lg:py-32"
          aria-labelledby="features-heading"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
            {/* Section Header with Stagger Animation */}
            <motion.header
              className="text-center mb-12 md:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2
                id="features-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 md:mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Powerful features for{" "}
                <motion.span
                  className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, backgroundPosition: "200% 0" }}
                  whileInView={{ opacity: 1, backgroundPosition: "0% 0" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  intelligent PDF analysis
                </motion.span>
              </motion.h2>
              <motion.p
                className="text-base md:text-lg lg:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Transform how you interact with documents using AI-powered
                retrieval and generation
              </motion.p>
            </motion.header>

            {/* BentoGrid Component with Entrance Animation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <BentoGrid />
            </motion.div>
          </div>
        </motion.section>

        {/* Footer Section with Fade In */}
        <motion.footer
          className="relative w-full mt-20 md:mt-24 lg:mt-28"
          role="contentinfo"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative w-full flex justify-center items-center py-8 md:py-12">
            <Footer />
          </div>
        </motion.footer>
      </div>
    </main>
  );
}

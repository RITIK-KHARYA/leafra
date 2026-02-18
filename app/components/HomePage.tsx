"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Database,
  FileText,
  Layout,
  Shield,
  Zap,
} from "lucide-react";
import BentoGrid from "@/components/custom/BentoGrid";
import Footer from "@/components/custom/footer";
import Header from "@/components/custom/landingheader";

const easeOut = [0.16, 1, 0.3, 1] as const;
const heroDuration = 0.45;
const reducedDuration = 0.15;

function useVariants(reduced: boolean) {
  const duration = reduced ? reducedDuration : heroDuration;
  const fadeInUp = {
    hidden: { opacity: 0, ...(reduced ? {} : { y: 20 }) },
    visible: {
      opacity: 1,
      ...(reduced ? {} : { y: 0 }),
      transition: { duration, ease: easeOut },
    },
  };
  const stagger = {
    visible: { transition: { staggerChildren: reduced ? 0.03 : 0.07 } },
  };
  return { fadeInUp, stagger };
}

export default function HomePage() {
  const reduced = useReducedMotion() ?? false;
  const { fadeInUp, stagger } = useVariants(reduced);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-emerald-500/30">
      {/* Background Noise & Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Header />

        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex justify-center">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Real-time Streaming
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent px-2"
            >
              Chat with your PDFs{" "}
              <span className="block sm:inline">Instantly.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed px-2"
            >
              Transform static documents into interactive conversations. Leafra
              uses advanced RAG technology to understand your PDFs and answer
              questions with precision.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2"
            >
              <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/dashboard"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white text-neutral-950 font-semibold hover:bg-neutral-200 transition-colors text-sm sm:text-base"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors text-sm sm:text-base"
                >
                  View on GitHub
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Tech Stack Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reduced ? 0.2 : 0.6,
              duration: reduced ? reducedDuration : 0.4,
              ease: easeOut,
            }}
            className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-10 border-t border-white/5 w-full max-w-5xl px-4"
          >
            <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-widest font-medium mb-6 sm:mb-8">
              Powered by Modern Tech Stack
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-6 md:gap-y-8 grayscale opacity-60 hover:opacity-100 transition-opacity duration-500">
              <span className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> Next.js 15
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 sm:w-5 sm:h-5" /> PostgreSQL
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                <Layout className="w-4 h-4 sm:w-5 sm:h-5" /> Pinecone
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" /> TogetherAI
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> Better-Auth
              </span>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              How Leafra Works
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              From upload to answer in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: (
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                ),
                title: "1. Upload PDF",
                desc: "Securely upload your documents. We process them in the background using robust worker queues.",
              },
              {
                icon: (
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                ),
                title: "2. Vector Indexing",
                desc: "Content is converted into semantic embeddings and stored in Pinecone for lightning-fast retrieval.",
              },
              {
                icon: <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
                title: "3. AI Chat",
                desc: "Ask questions naturally. Our AI retrieves relevant context and streams intelligent answers instantly.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px 0px" }}
                transition={{
                  duration: reduced ? reducedDuration : 0.25,
                  delay: reduced ? 0 : i * 0.08,
                  ease: easeOut,
                }}
                className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center mb-3 sm:mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="w-full py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10 md:mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Powerful Features
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Everything you need to interact with your knowledge base.
            </p>
          </div>
          <BentoGrid />
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px 0px" }}
            transition={{
              duration: reduced ? reducedDuration : 0.25,
              ease: easeOut,
            }}
            className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-linear-to-b from-emerald-900/20 to-neutral-900 border border-emerald-500/20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to dive in?
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mb-6 sm:mb-8 max-w-lg mx-auto">
              Join thousands of users leveraging AI to understand their
              documents faster. Open source and ready to deploy.
            </p>
            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Link
                href="/dashboard"
                className="inline-flex px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-sm sm:text-base"
              >
                Start Chatting Free
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>
      {/* <GpuSvg /> */}
    </div>
  );
}

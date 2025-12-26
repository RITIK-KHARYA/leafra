"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.header
        // 1. Initial State: Small, centered pill
        initial={{ width: "60px", opacity: 0 }}
        // 2. Animate State: Expand to final width (e.g., 50% or auto)
        animate={{ width: "50%", opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1], // Custom "expo" ease for that premium feel
          delay: 0.2,
        }}
        className="pointer-events-auto backdrop-blur-md border border-white/10 bg-black/20 rounded-full flex items-center overflow-hidden h-12 shadow-2xl"
      >
        <div className="w-full px-6 flex items-center justify-between whitespace-nowrap">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity"
          >
            Leafra
          </Link>

          {/* Navigation Links - Fades in after expansion starts */}
          <motion.nav
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link
              href="/how-to-use"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              How to Use
            </Link>
            <Link
              href="/features"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Features
            </Link>
            <Link
              href="/support"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Support
            </Link>
          </motion.nav>

          {/* Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href="/signin"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </motion.header>
    </div>
  );
}

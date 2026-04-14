"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const uiDuration = 0.2;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Close menu on escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduced ? 0.1 : uiDuration,
          ease: easeOut,
          delay: reduced ? 0 : 0.15,
        }}
        className="pointer-events-auto backdrop-blur-md border border-white/10 bg-black/20 rounded-full flex items-center overflow-visible sm:overflow-hidden h-11 sm:h-12 shadow-2xl w-full max-w-4xl"
      >
        <div className="w-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Link
              href="/"
              className="text-white font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity shrink-0"
            >
              Leafra
            </Link>
          </motion.span>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, ...(reduced ? {} : { x: -10 }) }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: reduced ? 0 : 0.25,
              duration: uiDuration,
              ease: easeOut,
            }}
            className="hidden md:flex items-center space-x-6 lg:space-x-8"
          >
            <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Link
                href="/how-to-use"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                How to Use
              </Link>
            </motion.span>
            <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Link
                href="/features"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Features
              </Link>
            </motion.span>
            <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Link
                href="/support"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Support
              </Link>
            </motion.span>
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="md:hidden text-white/90 hover:text-white transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center -m-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>

          {/* Desktop Sign In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.3, duration: uiDuration, ease: easeOut }}
            className="hidden md:block"
          >
            <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Link
                href="/signin"
                className="text-white/90 hover:text-white text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            </motion.span>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, ...(reduced ? {} : { y: -10 }) }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, ...(reduced ? {} : { y: -10 }) }}
              transition={{ duration: uiDuration, ease: easeOut }}
              className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:hidden z-50"
            >
            <nav className="flex flex-col space-y-3">
              <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/how-to-use"
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-sm transition-colors py-2 block"
                >
                  How to Use
                </Link>
              </motion.span>
              <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/features"
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-sm transition-colors py-2 block"
                >
                  Features
                </Link>
              </motion.span>
              <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/support"
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-sm transition-colors py-2 block"
                >
                  Support
                </Link>
              </motion.span>
              <motion.span whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="text-white/90 hover:text-white text-sm font-medium transition-colors py-2 border-t border-white/10 pt-3 mt-2 block"
                >
                  Sign In
                </Link>
              </motion.span>
            </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}

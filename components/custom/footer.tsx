"use client";

import { useState, useEffect } from "react";
import { Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative w-full text-gray-300 py-6 overflow-hidden">
      {/* Blue gradient in top right corner */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2">
          {/* Company Logo and Name */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo2.png"
              alt="Leafra - AI PDF RAG"
              width={40}
              height={40}
              className="object-center sm:w-[52px] sm:h-[52px]"
            />
            <span className="text-white font-medium text-sm sm:text-base">
              Leafra
            </span>
          </div>

          {/* Footer links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-gray-400">
            <Link
              href="/features"
              className="hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/glossary"
              className="hover:text-white transition-colors"
            >
              Glossary
            </Link>
            <Link
              href="/how-to-use"
              className="hover:text-white transition-colors"
            >
              How to Use
            </Link>
            <Link
              href="/support"
              className="hover:text-white transition-colors"
            >
              Support
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Twitter size={16} className="text-white" />
            </Link>
            <Link
              href="https://peerlist.io"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Peerlist"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center sm:text-right text-xs text-gray-500">
          <p>&copy; {year ?? "2024"} Leafra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

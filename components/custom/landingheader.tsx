"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="backdrop-blur-md border-2 rounded-lg border-white/10 mt-2 absolute top-0 z-50 w-1/2 ">
      <div className="w-full mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-medium text-sm tracking-tight hover:opacity-80 transition-opacity"
          >
            Leafra
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/how-to-use"
              className="text-white/80 hover:text-white text-sm font-normal transition-colors"
            >
              How to Use
            </Link>
            <Link
              href="/features"
              className="text-white/80 hover:text-white text-sm font-normal transition-colors"
            >
              Features
            </Link>
            <Link
              href="/support"
              className="text-white/80 hover:text-white text-sm font-normal transition-colors"
            >
              Support
            </Link>
          </nav>

          {/* Login */}
          <Link
            href="/login"
            className="text-white/80 hover:text-white text-sm font-normal transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}

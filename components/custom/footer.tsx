import { Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative w-[80%] rounded-t-3xl bg-black text-gray-300 py-6 overflow-hidden">
      {/* Blue gradient in top right corner */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl bg-graident from-blue-800/20 to-transparent via-neutral-950/20 -z-0 rounded-bl-full"></div>

      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-800/20 to-transparent via-neutral-950/20 -z-0 rounded-bl-full"></div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Company Logo and Name */}
          <div className="flex items-center gap-2">
            <Image
              src="/mainlogo.png"
              alt="Leafra Logo"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-white font-medium">Leafra</span>
          </div>

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
          <p>&copy; {new Date().getFullYear()} Leafra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

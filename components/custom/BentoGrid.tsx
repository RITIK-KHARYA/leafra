"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, GitBranch, MessageSquare } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-100px 0px" } as const;

// --- Custom SVG Components (Subtle & Linear Micro-Interactions) ---

interface SVGProps {
  isActive: boolean;
  color: string;
}

// 1. Upload & Parse: File Icon with a scanning beam
const ProcessingFileSVG = ({ isActive, color }: SVGProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-28 h-28 text-neutral-600 transition-[transform,opacity] duration-300 ${
      isActive ? "text-opacity-80 scale-105" : "text-opacity-40"
    }`}
  >
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Scanning Beam */}
    <rect
      x="4"
      y="0"
      width="16"
      height="2"
      fill={color}
      className="opacity-0"
      style={{
        opacity: isActive ? 0.5 : 0,
        filter: "blur(4px)",
        animation: isActive ? "scan 2s ease-in-out infinite" : "none",
      }}
    />
  </svg>
);

// 2. Smart Embeddings: Neural Nodes
const NetworkFlowSVG = ({ isActive, color }: SVGProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-28 h-28 text-neutral-600 transition-[transform,opacity] duration-300 ${
      isActive ? "text-opacity-80 scale-105" : "text-opacity-40"
    }`}
  >
    <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 18 L18 6" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
    <path d="M6 18 L18 18" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
    
    {/* Active pulses */}
    {[
      { cx: 6, cy: 18, delay: "0s" },
      { cx: 18, cy: 6, delay: "0.5s" },
      { cx: 18, cy: 18, delay: "1s" }
    ].map((dot, i) => (
      <circle
        key={i}
        cx={dot.cx}
        cy={dot.cy}
        r="2"
        fill={color}
        className="opacity-0"
        style={{
          animation: isActive ? `pulse 2s ease-out infinite ${dot.delay}` : "none",
        }}
      />
    ))}
  </svg>
);

// 3. Contextual Chat: Message Stream
const TypingChatSVG = ({ isActive, color }: SVGProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-28 h-28 text-neutral-600 transition-[transform,opacity] duration-300 ${
      isActive ? "text-opacity-80 scale-105" : "text-opacity-40"
    }`}
  >
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M8 10h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="origin-left transition-[transform,opacity] duration-300"
      style={{ transform: isActive ? "scaleX(1)" : "scaleX(0.5)" }}
    />
    <path
      d="M8 14h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="origin-left transition-[transform,opacity] duration-300 delay-75"
      style={{ transform: isActive ? "scaleX(1)" : "scaleX(0.5)" }}
    />
    <circle
      cx="18"
      cy="14"
      r="1.5"
      fill={color}
      className="opacity-0"
      style={{
        animation: isActive ? "blink 1.5s ease-in-out infinite" : "none",
      }}
    />
  </svg>
);

// --- Main Bento Grid Component ---

const RagBentoGridSleek = () => {
  const [activeId, setActiveId] = useState(2);

  const cards = [
    {
      id: 1,
      label: "Ingestion",
      title: "Upload & Parse",
      description: "Extract text and metadata instantly.",
      buttonText: "Upload",
      icon: <FileText className="w-3.5 h-3.5" />,
      color: "#0d9488", // Dark Teal/Green
      hoverBg: "group-hover:bg-emerald-950/30",
      borderColor: "group-hover:border-emerald-500/30",
      Component: ProcessingFileSVG,
    },
    {
      id: 2,
      label: "RAG Core",
      title: "Ask AI",
      description: "Retrieve precise citations from docs.",
      buttonText: "Chat",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      color: "#1e3a8a", // Dark Blue
      hoverBg: "group-hover:bg-blue-950/30",
      borderColor: "group-hover:border-blue-500/30",
      Component: TypingChatSVG,
    },
    {
      id: 3,
      label: "Indexing",
      title: "Embeddings",
      description: "Semantic search via vector database.",
      buttonText: "Index",
      icon: <GitBranch className="w-3.5 h-3.5" />,
      color: "#581c87", // Dark Purple
      hoverBg: "group-hover:bg-purple-950/30",
      borderColor: "group-hover:border-purple-500/30",
      Component: NetworkFlowSVG,
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes scan {
            0% { transform: translateY(4px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(20px); opacity: 0; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          @keyframes blink {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <motion.div
        className="w-full flex justify-center py-6 sm:py-10 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        <div className="w-full max-w-5xl h-auto sm:h-[400px] md:h-[450px] flex flex-col sm:flex-row gap-3">
          {cards.map((card, index) => {
            const isActive = activeId === card.id;
            return (
              <motion.div
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.25, ease: easeOut },
                  },
                }}
                onMouseEnter={() => setActiveId(card.id)}
                onClick={() => setActiveId(card.id)}
                className={`
                  relative group h-[280px] sm:h-full rounded-xl sm:rounded-2xl cursor-pointer overflow-hidden
                  bg-neutral-900/40 border border-white/5 backdrop-blur-sm
                  ${isActive ? "flex-2" : "flex-[0.8] hover:flex-[0.9]"}
                `}
                style={{
                  boxShadow: isActive ? `0 0 30px -10px ${card.color}40` : "none",
                  transition: "box-shadow 0.2s ease-out",
                }}
              >
                {/* Dynamic Background Glow */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${card.hoverBg}`}
                />

                {/* Active Border Overlay */}
                <div
                  className="absolute inset-0 border-2 rounded-2xl border-transparent transition-[border-color,opacity] duration-200"
                  style={{
                    borderColor: isActive ? card.color : "transparent",
                    opacity: isActive ? 0.2 : 0,
                  }}
                />

                {/* Content Container */}
                <div className="relative h-full flex flex-col p-4 sm:p-6 z-10">
                  {/* Header Badge */}
                  <div
                    className={`
                    flex items-center gap-2 self-start px-3 py-1.5 rounded-full 
                    text-xs font-medium tracking-wide transition-[background-color,color,opacity] duration-200
                    ${isActive ? "bg-white/10 text-white" : "bg-white/5 text-neutral-500"}
                  `}
                  >
                    <span style={{ color: isActive ? card.color : "currentColor" }}>{card.icon}</span>
                    <span className={`transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                      {card.label}
                    </span>
                  </div>

                  {/* Main Visual - transform and opacity only */}
                  <div
                    className={`
                    flex-1 flex items-center justify-center transition-[transform,opacity] duration-300
                    ${isActive ? "scale-100 translate-y-0" : "scale-90 opacity-60 grayscale"}
                  `}
                  >
                    <card.Component isActive={isActive} color={card.color} />
                  </div>

                  {/* Bottom Text Content */}
                  <div
                    className={`
                    space-y-3 transition-[transform,opacity] duration-200
                    ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-50"}
                  `}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {card.title}
                    </h3>

                    <div
                      className="overflow-hidden transition-[opacity,clip-path] duration-200"
                      style={{
                        opacity: isActive ? 1 : 0,
                        clipPath: isActive ? "inset(0)" : "inset(100% 0 0 0)",
                      }}
                    >
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-4">
                        {card.description}
                      </p>
                      
                      <div className="flex items-center text-xs font-semibold uppercase tracking-wider group/btn" style={{ color: card.color }}>
                        {card.buttonText}
                        <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default RagBentoGridSleek;

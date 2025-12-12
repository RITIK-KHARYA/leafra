import React, { useState } from "react";
import { FileText, GitBranch, MessageSquare } from "lucide-react";

// --- Custom SVG Components (Subtle & Linear Micro-Interactions) ---

// 1. Upload & Parse: File Icon with a subtle progress bar reveal.
const ProcessingFileSVG = ({ isActive, color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-36 h-36 transition-opacity duration-500 text-gray-700`}
  >
    {/* Document Body */}
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="14 2 14 8 20 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Linear Progress Indicator (Slow draw animation) */}
    <rect
      x="7"
      y="14"
      width="10"
      height="2"
      rx="1"
      fill="currentColor"
      className={`transition-all duration-1000 ease-out`}
      style={{
        width: isActive ? "10px" : "0px",
        opacity: isActive ? 1 : 0.5,
        fill: color, // Use accent color for the moving element
      }}
    />
  </svg>
);

// 2. Smart Embeddings: Connecting nodes with a graceful flow effect.
const NetworkFlowSVG = ({ isActive, color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-36 h-36 transition-opacity duration-500 text-gray-700`}
  >
    {/* Nodes */}
    <circle cx="6" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5" />

    {/* Connecting Lines (Always present) */}
    <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="1" />
    <line
      x1="6"
      y1="18"
      x2="18"
      y2="18"
      stroke="currentColor"
      strokeWidth="1"
    />

    {/* Flow Indicator (A small white dot moves along the line) */}
    <circle
      cx="6"
      cy="18"
      r="1"
      fill="white"
      className={`transition-all duration-3000 ease-in-out`}
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translate(12px, -12px)" : "translate(0, 0)", // Moves diagonally
        fill: color, // Use accent color for the moving element
      }}
    />
  </svg>
);

// 3. Contextual Chat: Message bubble with a clean, fading typing indicator.
const TypingChatSVG = ({ isActive, color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-36 h-36 transition-opacity duration-500 text-gray-700`}
  >
    {/* Chat Bubble */}
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      stroke="currentColor"
      strokeWidth="1.5"
    />

    {/* Typing Dots Indicator (Subtle opacity fade) */}
    <circle
      cx="8"
      cy="12"
      r="1"
      fill="currentColor"
      className={isActive ? "animate-[fade_1.5s_infinite_0s]" : "opacity-0"}
    />
    <circle
      cx="12"
      cy="12"
      r="1"
      fill="currentColor"
      className={isActive ? "animate-[fade_1.5s_infinite_0.2s]" : "opacity-0"}
    />
    <circle
      cx="16"
      cy="12"
      r="1"
      fill="currentColor"
      className={isActive ? "animate-[fade_1.5s_infinite_0.4s]" : "opacity-0"}
    />
  </svg>
);

// --- Main Bento Grid Component ---

const RagBentoGridSleek = () => {
  const [activeId, setActiveId] = useState(2);

  const cards = [
    {
      id: 1,
      label: "Document Ingestion",
      title: "Upload & Parse Files",
      description:
        "Seamlessly ingest documents. Our OCR extracts text, tables, and metadata instantly, transforming raw files into a searchable knowledge base.",
      buttonText: "Start Ingestion",
      icon: <FileText className="w-4 h-4" />,
      color: "#06b6d4",
      Component: ProcessingFileSVG,
    }, // Cyan
    {
      id: 2,
      label: "Core RAG System",
      title: "Ask AI Anything...",
      description:
        "Interact with your documents naturally. The LLM retrieves precise citations and generates answers based strictly on your source material.",
      buttonText: "Launch Chat",
      icon: <MessageSquare className="w-4 h-4" />,
      color: "#10b981",
      Component: TypingChatSVG,
    }, // Emerald/Green
    {
      id: 3,
      label: "Vector & Indexing",
      title: "Smart Embeddings",
      description:
        "Convert unstructured data into high-dimensional vectors, enabling semantic search and millisecond-latency context retrieval.",
      buttonText: "View Index",
      icon: <GitBranch className="w-4 h-4" />,
      color: "#6366f1",
      Component: NetworkFlowSVG,
    }, // Indigo
  ];

  return (
    <>
      {/* Custom Keyframes for Subtle Animations (Only opacity) */}
      <style>
        {`
          @keyframes fade {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>

      <div className="w-full h-screen bg-transparent flex items-center justify-center p-12">
        <div className="w-full max-w-7xl h-[600px] flex gap-4">
          {cards.map((card) => {
            const isActive = activeId === card.id;
            return (
              <div
                key={card.id}
                onMouseEnter={() => setActiveId(card.id)}
                className={`
                  relative h-full rounded-xl cursor-pointer overflow-hidden
                  transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                  bg-neutral-900/50 border border-neutral-800/30
                  ${
                    isActive
                      ? "flex-3 border-white/20"
                      : "flex-1 opacity-80 hover:opacity-90"
                  }
                `}
                // Accent Shadow only on the active card
                style={{
                  boxShadow: isActive
                    ? `0 0 20px -5px ${card.color}99`
                    : "none",
                  border: isActive
                    ? `1px solid ${card.color}`
                    : "1px solid var(--tw-border-gray-800)",
                }}
              >
                {/* Visual Icon (Muted background element) */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 opacity-10 scale-125`}
                >
                  <card.Component isActive={isActive} color={card.color} />
                </div>

                {/* Inner Content Area */}
                <div className="relative h-full flex flex-col justify-between p-8 z-10">
                  {/* Top Header */}
                  <div
                    className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md transition-all duration-300`}
                      style={{
                        backgroundColor: isActive ? card.color : "transparent",
                      }}
                    >
                      {card.icon}
                    </div>
                    <span
                      className={
                        isActive ? "opacity-100 block" : "opacity-0 hidden"
                      }
                    >
                      {card.label}
                    </span>
                  </div>

                  {/* Bottom Content (Title, Desc, Button) */}
                  <div
                    className={`flex flex-col gap-5 transition-all duration-500 ${
                      isActive ? "translate-y-0" : "translate-y-4"
                    }`}
                  >
                    <h2
                      className={`text-2xl font-bold text-white leading-snug whitespace-nowrap transition-transform duration-500`}
                    >
                      {card.title}
                    </h2>

                    <div
                      className={`space-y-6 overflow-hidden transition-all duration-300 ${
                        isActive
                          ? "max-h-96 opacity-100 delay-200"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                        {card.description}
                      </p>

                      {/* Button with Accent */}
                      <button
                        className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2 text-gray-900"
                        style={{
                          backgroundColor: card.color,
                        }}
                      >
                        {card.buttonText}
                        <span className="text-lg">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RagBentoGridSleek;

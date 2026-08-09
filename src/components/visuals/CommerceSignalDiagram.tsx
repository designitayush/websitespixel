"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

const nodes = [
  { id: "behavior", label: "Customer behavior", x: 50, y: 15 },
  { id: "discovery", label: "Product discovery", x: 15, y: 50 },
  { id: "messaging", label: "Smart messaging", x: 50, y: 50 },
  { id: "experiments", label: "Conversion experiments", x: 85, y: 50 },
  { id: "revenue", label: "Revenue signal", x: 50, y: 85 },
];

const connections = [
  ["behavior", "discovery"],
  ["behavior", "messaging"],
  ["behavior", "experiments"],
  ["discovery", "revenue"],
  ["messaging", "revenue"],
  ["experiments", "revenue"],
];

export function CommerceSignalDiagram() {
  const reducedMotion = useReducedMotion();

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div
      className="relative aspect-square w-full max-w-lg mx-auto rounded-3xl border border-graphite-200/30 bg-graphite/40 p-8"
      role="img"
      aria-label="Diagram showing customer behavior feeding into product discovery, smart messaging, and conversion experiments, which combine to produce revenue signals"
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {connections.map(([from, to], i) => {
          const a = getNode(from);
          const b = getNode(to);
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke="rgba(200,255,61,0.15)"
              strokeWidth="1"
              initial={reducedMotion ? {} : { pathLength: 0, opacity: 0 }}
              animate={reducedMotion ? {} : { pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.15 }}
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={reducedMotion ? {} : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
        >
          <div
            className={`rounded-xl border px-3 py-2 text-center text-xs font-medium backdrop-blur-sm ${
              node.id === "revenue"
                ? "border-lime/40 bg-lime/10 text-lime"
                : node.id === "behavior"
                  ? "border-violet-glow/30 bg-violet-glow/10 text-offwhite"
                  : "border-graphite-200/40 bg-graphite/80 text-muted"
            }`}
          >
            {node.label}
          </div>
        </motion.div>
      ))}

      {!reducedMotion && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/5"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

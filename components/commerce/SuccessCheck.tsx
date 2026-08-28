"use client";

import { motion } from "framer-motion";

export default function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -24 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
      className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,0.4)]"
    >
      <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
        <defs>
          <linearGradient
            id="success-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          fill="none"
          stroke="url(#success-grad)"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <motion.path
          d="M15 27l8 8 15-16"
          fill="none"
          stroke="url(#success-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

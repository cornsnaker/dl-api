"use client";

import { motion } from "framer-motion";

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={`shimmer-bg rounded-lg bg-white/[0.04] ${className ?? ""}`} />
  );
}

export default function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card mx-auto w-full max-w-3xl overflow-hidden p-6"
    >
      {/* Thumbnail skeleton */}
      <div className="flex flex-col gap-5 sm:flex-row">
        <ShimmerBlock className="h-40 w-full flex-shrink-0 sm:w-60" />

        {/* Metadata skeleton */}
        <div className="flex flex-1 flex-col gap-3">
          <ShimmerBlock className="h-6 w-3/4" />
          <ShimmerBlock className="h-4 w-1/2" />
          <ShimmerBlock className="h-4 w-1/3" />
          <ShimmerBlock className="mt-2 h-3 w-full" />
          <ShimmerBlock className="h-3 w-5/6" />
        </div>
      </div>

      {/* Media buttons skeleton */}
      <div className="mt-6 space-y-4">
        <ShimmerBlock className="h-5 w-24" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ShimmerBlock className="h-12" />
          <ShimmerBlock className="h-12" />
          <ShimmerBlock className="h-12" />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <ShimmerBlock className="h-5 w-20" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ShimmerBlock className="h-12" />
          <ShimmerBlock className="h-12" />
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import type { ExtractResponse, SuccessResponse } from "@/lib/types";
import MediaResultCard from "@/components/MediaResultCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const loading = isPending || isLoading;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) return;

      setResult(null);
      setError(null);
      setIsLoading(true);

      startTransition(async () => {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
          const res = await fetch(`${apiBase}/extract`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: trimmed, include_raw: false }),
          });

          const json: ExtractResponse = await res.json();

          if (json.status === "error") {
            setError(json.message ?? "Something went wrong.");
          } else {
            setResult(json as SuccessResponse);
          }
        } catch {
          setError("Network error — could not reach the API.");
        } finally {
          setIsLoading(false);
        }
      });
    },
    [url],
  );

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
      {/* ── Background mesh ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-mesh"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-[120px]"
      />

      {/* ── Hero ── */}
      <section className="flex w-full max-w-3xl flex-col items-center px-4 pb-6 pt-24 text-center sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] px-4 py-1.5 text-xs font-medium text-purple-300"
        >
          <Sparkles size={14} className="animate-glow-pulse" />
          Smart Media Extractor
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl"
        >
          Download Anything.
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Beautifully.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-lg text-base leading-relaxed text-white/45"
        >
          Paste a link from YouTube, Instagram, TikTok or any supported platform
          and get instant download options for video, audio, images & subtitles.
        </motion.p>

        {/* ── Input form ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 w-full"
        >
          <div className="group relative flex items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-glow backdrop-blur-xl transition-all duration-300 focus-within:border-purple-500/40 focus-within:shadow-glow-lg">
            <Link2
              size={20}
              className="ml-5 flex-shrink-0 text-white/30 transition-colors group-focus-within:text-purple-400"
            />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a video or media link…"
              required
              className="flex-1 bg-transparent px-4 py-4 text-sm text-white placeholder-white/25 outline-none sm:text-base"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="mr-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Extract
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </section>

      {/* ── Results area ── */}
      <section className="w-full max-w-3xl px-4 pb-20">
        <AnimatePresence mode="wait">
          {/* Loading */}
          {loading && (
            <motion.div
              key="skeleton"
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <SkeletonCard />
            </motion.div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="glass-card mx-auto flex max-w-3xl items-start gap-4 border-red-500/20 p-5"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-300">
                  Extraction failed
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/50">
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          {/* Success */}
          {!loading && result && (
            <motion.div
              key="result"
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <MediaResultCard data={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto w-full border-t border-white/[0.04] py-6 text-center text-xs text-white/20">
        Smart Media Extractor &middot; Powered by dl-api
      </footer>
    </main>
  );
}

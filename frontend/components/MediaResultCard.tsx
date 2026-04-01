"use client";

import { motion } from "framer-motion";
import {
  Download,
  Film,
  Music,
  Image as ImageIcon,
  Subtitles,
  VolumeX,
  Clock,
  User,
} from "lucide-react";
import type {
  SuccessResponse,
  VideoFormat,
  AudioFormat,
  ImageAsset,
  SubtitleTrack,
} from "@/lib/types";
import { formatBytes, getProviderTheme, buildDownloadUrl } from "@/lib/utils";

/* ── Stagger children animation ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/* ── Sub‑components ── */

function SectionLabel({
  icon: Icon,
  label,
  accentText,
}: {
  icon: React.ElementType;
  label: string;
  accentText: string;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
      <Icon size={16} className={accentText} />
      {label}
    </h3>
  );
}

function DownloadButton({
  href,
  label,
  badge,
  size,
  noAudio,
  accent,
}: {
  href: string;
  label: string;
  badge?: string;
  size: string;
  noAudio?: boolean;
  accent: string;
}) {
  return (
    <motion.a
      variants={itemVariants}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass-card-hover group flex items-center justify-between gap-3 px-4 py-3`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-lg`}
        >
          <Download size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/90">{label}</span>
          <span className="text-xs text-white/40">{size}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {noAudio && (
          <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
            <VolumeX size={10} /> No audio
          </span>
        )}
        {badge && (
          <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-white/50">
            {badge}
          </span>
        )}
      </div>
    </motion.a>
  );
}

/* ── Main card ── */

export default function MediaResultCard({
  data,
}: {
  data: SuccessResponse;
}) {
  const theme = getProviderTheme(data.provider);
  const proxyRequired = data.config?.proxy_required ?? false;
  const { metadata, media } = data;

  const hasVideos = media.video_mp4.length > 0;
  const hasAudio = media.audio_only.length > 0;
  const hasImages = media.images.length > 0;
  const hasSubtitles = media.subtitles.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card relative mx-auto w-full max-w-3xl overflow-hidden ${theme.glow}`}
    >
      {/* Provider watermark */}
      <span className="pointer-events-none absolute right-4 top-4 select-none text-6xl font-black uppercase leading-none tracking-tighter text-white/[0.03]">
        {theme.icon}
      </span>

      {/* ── Thumbnail + metadata ── */}
      <div className="flex flex-col gap-5 p-6 sm:flex-row">
        {metadata.thumbnail && (
          <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              className="h-full w-full object-cover"
            />
            {metadata.duration && (
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                <Clock size={10} />
                {metadata.duration}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full ${theme.bg} px-3 py-1 text-xs font-semibold capitalize ${theme.accentText}`}
          >
            {data.provider}
          </span>
          <h2 className="text-lg font-bold leading-snug text-white/95 line-clamp-2">
            {metadata.title}
          </h2>
          {metadata.author && (
            <p className="flex items-center gap-1.5 text-sm text-white/50">
              <User size={13} />
              {metadata.author}
            </p>
          )}
          {metadata.description && (
            <p className="mt-1 text-xs leading-relaxed text-white/35 line-clamp-3">
              {metadata.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Download sections ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5 border-t border-white/[0.06] px-6 py-5"
      >
        {/* Video formats */}
        {hasVideos && (
          <div className="space-y-3">
            <SectionLabel icon={Film} label="Video" accentText={theme.accentText} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {media.video_mp4.map((v: VideoFormat, i: number) => (
                <DownloadButton
                  key={`video-${i}`}
                  href={buildDownloadUrl(v.url, proxyRequired)}
                  label={`${v.quality} ${v.extension.toUpperCase()}`}
                  badge={v.extension}
                  size={formatBytes(v.size_bytes)}
                  noAudio={v.has_audio === false}
                  accent={theme.accent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Audio formats */}
        {hasAudio && (
          <div className="space-y-3">
            <SectionLabel icon={Music} label="Audio" accentText={theme.accentText} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {media.audio_only.map((a: AudioFormat, i: number) => (
                <DownloadButton
                  key={`audio-${i}`}
                  href={buildDownloadUrl(a.url, proxyRequired)}
                  label={`${a.quality} Audio`}
                  badge={a.ext}
                  size={formatBytes(a.size_bytes)}
                  accent={theme.accent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {hasImages && (
          <div className="space-y-3">
            <SectionLabel icon={ImageIcon} label="Images" accentText={theme.accentText} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {media.images.map((img: ImageAsset, i: number) => (
                <motion.a
                  key={`img-${i}`}
                  variants={itemVariants}
                  href={buildDownloadUrl(img.url, proxyRequired)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-hover group overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`Image ${i + 1}`}
                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex items-center justify-center gap-1.5 py-2 text-xs text-white/50">
                    <Download size={12} /> Image {i + 1}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* Subtitles */}
        {hasSubtitles && (
          <div className="space-y-3">
            <SectionLabel icon={Subtitles} label="Subtitles" accentText={theme.accentText} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {media.subtitles.map((s: SubtitleTrack, i: number) => (
                <DownloadButton
                  key={`sub-${i}`}
                  href={buildDownloadUrl(s.url, proxyRequired)}
                  label={s.language}
                  badge={s.format.toUpperCase()}
                  size={s.lang_code.toUpperCase()}
                  accent={theme.accent}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

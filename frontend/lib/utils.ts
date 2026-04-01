/* ── Utility helpers ── */

/** Format bytes to a human‑readable string (KB / MB / GB). */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Provider → accent colour mapping. */
export function getProviderTheme(provider: string) {
  switch (provider.toLowerCase()) {
    case "youtube":
      return {
        accent: "from-red-500 to-red-700",
        accentText: "text-red-400",
        glow: "shadow-glow-youtube",
        border: "border-red-500/30",
        bg: "bg-red-500/10",
        icon: "YouTube",
      };
    case "instagram":
      return {
        accent: "from-pink-500 to-purple-600",
        accentText: "text-pink-400",
        glow: "shadow-glow-instagram",
        border: "border-pink-500/30",
        bg: "bg-pink-500/10",
        icon: "Instagram",
      };
    case "tiktok":
      return {
        accent: "from-cyan-400 to-pink-500",
        accentText: "text-cyan-400",
        glow: "shadow-glow-tiktok",
        border: "border-cyan-400/30",
        bg: "bg-cyan-400/10",
        icon: "TikTok",
      };
    default:
      return {
        accent: "from-purple-500 to-pink-500",
        accentText: "text-purple-400",
        glow: "shadow-glow",
        border: "border-purple-500/30",
        bg: "bg-purple-500/10",
        icon: provider || "Media",
      };
  }
}

/** Build the download URL — proxy if required, direct otherwise. */
export function buildDownloadUrl(
  mediaUrl: string,
  proxyRequired: boolean,
): string {
  if (!proxyRequired) return mediaUrl;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}/stream?media_url=${encodeURIComponent(mediaUrl)}`;
}

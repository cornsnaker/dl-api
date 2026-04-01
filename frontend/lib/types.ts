/* ── API response types matching the backend schema ── */

export interface VideoFormat {
  quality: string;
  url: string;
  size_bytes: number | null;
  extension: string;
  has_audio: boolean;
}

export interface AudioFormat {
  quality: string;
  url: string;
  ext: string;
  size_bytes: number | null;
}

export interface ImageAsset {
  url: string;
  width?: number;
  height?: number;
}

export interface SubtitleTrack {
  lang_code: string;
  language: string;
  url: string;
  format: string;
}

export interface StandardizedMedia {
  video_mp4: VideoFormat[];
  audio_only: AudioFormat[];
  images: ImageAsset[];
  subtitles: SubtitleTrack[];
}

export interface StandardizedMetadata {
  title: string;
  author: string;
  duration: string | null;
  thumbnail: string | null;
  description: string | null;
}

export interface StandardizedConfig {
  proxy_required: boolean;
  headers?: Record<string, string>;
  expires_at?: number | null;
}

export interface SuccessResponse {
  status: "success";
  provider: string;
  metadata: StandardizedMetadata;
  media: StandardizedMedia;
  config: StandardizedConfig;
}

export interface ErrorResponse {
  status: "error";
  message: string;
  provider?: string;
  code?: string;
}

export type ExtractResponse = SuccessResponse | ErrorResponse;

export type Provider =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "twitter"
  | string;

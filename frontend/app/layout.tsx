import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Media Extractor — Download Videos, Audio & More",
  description:
    "Extract and download media from YouTube, Instagram, TikTok and more. Fast, free, and beautiful.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

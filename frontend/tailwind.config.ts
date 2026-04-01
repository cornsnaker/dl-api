import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "rgba(15, 15, 25, 0.6)",
          solid: "#0a0a14",
        },
        neon: {
          purple: "#a855f7",
          pink: "#ec4899",
          cyan: "#06b6d4",
          blue: "#3b82f6",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 20% 80%, rgba(168,85,247,0.15) 0%, transparent 50%), radial-gradient(at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 50%), radial-gradient(at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)",
        "glow-purple":
          "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(236,72,153,0.4))",
        "glow-youtube":
          "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(220,38,38,0.4))",
        "glow-instagram":
          "linear-gradient(135deg, rgba(236,72,153,0.4), rgba(168,85,247,0.4))",
        "glow-tiktok":
          "linear-gradient(135deg, rgba(6,182,212,0.4), rgba(236,72,153,0.4))",
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "border-glow": "border-glow 4s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(168,85,247,0.3)" },
          "50%": { borderColor: "rgba(236,72,153,0.5)" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(168,85,247,0.15), 0 0 60px rgba(168,85,247,0.05)",
        "glow-lg":
          "0 0 40px rgba(168,85,247,0.2), 0 0 80px rgba(168,85,247,0.1)",
        "glow-youtube":
          "0 0 20px rgba(239,68,68,0.15), 0 0 60px rgba(239,68,68,0.05)",
        "glow-instagram":
          "0 0 20px rgba(236,72,153,0.15), 0 0 60px rgba(168,85,247,0.05)",
        "glow-tiktok":
          "0 0 20px rgba(6,182,212,0.15), 0 0 60px rgba(236,72,153,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

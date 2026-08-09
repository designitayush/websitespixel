import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Design-system breakpoints: tablet from 810px, desktop from 1200px.
        tab: "810px",
        desk: "1200px",
      },
      colors: {
        // Legacy dark-system tokens (removed as sections migrate)
        canvas: "#090A0C",
        graphite: {
          DEFAULT: "#14161A",
          50: "#1A1D22",
          100: "#22262D",
          200: "#2A2F38",
        },
        offwhite: "#F2EFE8",
        muted: "#9A9690",
        lime: {
          DEFAULT: "#C8FF3D",
          dim: "#A8D933",
        },
        violet: {
          glow: "#6B5CE7",
        },
        blue: {
          glow: "#4A9EFF",
        },
        // New design system
        paper: "#F9F8F6",
        surface: "#FFFFFF",
        ink: "#141414",
        body: "#656565",
        faint: "#A4A4A4",
        accent: "#FF0000",
        line: "rgba(0,0,0,0.08)",
        "line-dark": "rgba(255,255,255,0.10)",
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        chip: "0 0 0 1px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04), 0 24px 40px -16px rgba(0,0,0,.08)",
        card: "0 0 0 1px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04), 0 40px 40px -24px rgba(0,0,0,.08)",
        btn: "0 1px 1px rgba(0,0,0,.12), 0 1.5px 3px rgba(0,0,0,.2), 0 4px 8px rgba(0,0,0,.2), 0 12px 24px -6px rgba(0,0,0,.3)",
        // Legacy dark-system shadows (removed as sections migrate)
        "card-depth": "0 24px 80px -24px rgba(0, 0, 0, 0.6)",
        "accent-soft": "0 0 40px -12px rgba(200, 255, 61, 0.35)",
      },
      borderRadius: {
        page: "8px",
        toolbar: "12px",
        media: "20px",
        card: "24px",
        video: "32px",
        hero: "40px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      maxWidth: {
        canvas: "1440px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

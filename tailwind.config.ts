import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        border: "var(--border)",
        border2: "var(--border2)",
        text: "var(--text)",
        muted: "var(--muted)",
        muted2: "var(--muted2)",
        green: "var(--green)",
        "green-dim": "var(--green-dim)",
        "green-bg": "var(--green-bg)",
        red: "var(--red)",
        "red-dim": "var(--red-dim)",
        "red-bg": "var(--red-bg)",
        amber: "var(--amber)",
        "amber-bg": "var(--amber-bg)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

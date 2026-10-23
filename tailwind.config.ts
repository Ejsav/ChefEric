import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// Utilities read from CSS variables in app/globals.css. Tones (dark / linen)
// swap the variables, so every component works on both without variants.
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        "bg-elevated": "rgb(var(--bg-elevated) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        "fg-muted": "rgb(var(--fg-muted) / <alpha-value>)",
        line: "rgb(var(--fg) / 0.14)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        oxblood: "rgb(var(--oxblood) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", '"Instrument Serif"', "Didot", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        silk: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      maxWidth: { container: "var(--container)" },
    },
  },
  plugins: [
    // short: — short screens (phones in landscape, pages zoomed to 200%).
    plugin(({ addVariant }) => addVariant("short", "@media (max-height: 560px)")),
  ],
} satisfies Config;

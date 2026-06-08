import pequiPreset from "./packages/ui/dist/tailwind/preset.js";
import type { Config } from "tailwindcss";

export default {
  presets: [pequiPreset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./packages/ui/src/**/*.{ts,tsx}",
    "./packages/ui/dist/**/*.{js,css}",
  ],
} satisfies Config;

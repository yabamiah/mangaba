import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/buttons/index.ts",
    "src/hooks/index.ts",
    "src/tailwind/preset.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  // Copy CSS files to dist
  onSuccess: async () => {
    const { cpSync, mkdirSync } = await import("fs");
    mkdirSync("dist/styles", { recursive: true });
    cpSync("src/styles", "dist/styles", { recursive: true });
    mkdirSync("dist/components/buttons", { recursive: true });
    cpSync("src/components/buttons/buttons.css", "dist/components/buttons/buttons.css");
  },
});

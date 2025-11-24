import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: true },
  splitting: true,
  sourcemap: true,
  cjsInterop: true,
  clean: true,
  minify: false,
  publicDir: "public",
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "next",
    "motion/react",
    "chess.js",
    "lucide-react",
    "next-themes",
  ],
});

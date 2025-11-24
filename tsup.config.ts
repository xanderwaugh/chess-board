import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    resolve: true,
  },
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  cjsInterop: true,
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

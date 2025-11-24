import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { cleandir } from "rollup-plugin-cleandir";
import copy from "rollup-plugin-copy";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

/** @type {import('rollup').RollupOptions} */
const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    onwarn: (warning, warn) => {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
        return; // Ignore this specific warning
      }
      warn(warning);
    },
    plugins: [
      cleandir("dist"),
      peerDepsExternal(),
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        declaration: true,
        declarationMap: true,
        declarationDir: "dist/types",
        outputToFilesystem: true,
        exclude: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.stories.ts",
          "**/*.stories.tsx",
          "src/app/**/*",
          "node_modules/**",
        ],
      }),
      // postcss is kept for potential CSS imports in components
      postcss({
        config: {
          path: "./postcss.config.mjs",
        },
        plugins: [],
        extensions: [".css"],
        minimize: true,
        extract: true,
        inject: { insertAt: "top" },
      }),
      json(),
      copy({
        targets: [
          { src: "public/pieces", dest: "dist" },
          { src: "public/audio", dest: "dist" },
          // { src: "src/styles/styles.css", dest: "dist" },
        ],
      }),
      terser(),
    ],
    external: [
      "react",
      "react-dom",
      "next",
      "motion/react",
      "chess.js",
      "lucide-react",
      "sonner",
      "next-themes",
    ],
  },
];

export default config;

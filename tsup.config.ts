import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  splitting: false,
  sourcemap: false,
  minify: false,
  clean: false,
  outDir: "dist",
  external: ["react-dom", "next"],
  banner: {
    js: 'import React from "react";\n// Next.js font loaders - must remain as const declarations',
  },
});


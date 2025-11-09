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
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "next"],
  noExternal: [],
  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
    };
    // Don't process CSS files - they'll be copied separately
    options.loader = {
      ...options.loader,
      ".css": "empty",
    };
  },
  // Disable PostCSS processing
  postcss: false,
});


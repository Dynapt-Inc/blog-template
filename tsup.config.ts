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
  // Externalize React and related packages to avoid bundling issues with hooks
  external: ["react", "react-dom", "next"],
});


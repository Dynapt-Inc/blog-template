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
  clean: false, // Don't clean since we copy CSS separately
  outDir: "dist",
  external: ["react", "react-dom", "next"],
  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
    };
  },
});


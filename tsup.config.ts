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
  minify: false, // Prevent minification that changes const to var
  clean: false, // Don't clean since we copy CSS separately
  outDir: "dist",
  external: ["react", "react-dom", "next"],
  banner: {
    js: '// Next.js font loaders - must remain as const declarations',
  },
});


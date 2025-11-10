import { defineConfig } from "tsup";

export default defineConfig([
  {
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
    banner: {
      js: '// Next.js font loaders - must remain as const declarations',
    },
  },
  {
    entry: {
      Header: "src/components/Header.tsx",
      PostsIndexClient: "src/components/PostsIndexClient.tsx",
      PostCard: "src/components/PostCard.tsx",
    },
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
    external: ["react", "react-dom", "next"],
  },
]);


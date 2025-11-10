import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "esm",
      banner: "// Next.js font loaders - must remain as const declarations",
    },
    external: ["react", "react-dom", "next"],
    plugins: [typescript()],
  },
  {
    input: "dist/index.d.ts",
    output: {
      file: "dist/index.d.mts",
      format: "esm",
    },
    plugins: [dts()],
  },
];

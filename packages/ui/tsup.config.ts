import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: [
    "src/index.ts",
    "src/components/button/index.ts",
    "src/components/input/index.ts",
    "src/components/label/index.ts",
    "src/components/checkbox/index.ts",
    "src/components/badge/index.ts",
    "src/components/card/index.ts",
    "src/components/dialog/index.ts",
    "src/components/select/index.ts",
    "src/components/tabs/index.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    /^@radix-ui\//,
    "lucide-react",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
  ...options,
}));

import { defineConfig } from "vite";
import path from "node:path";

const externals = ["lucide-react", "react", "react/jsx-runtime"];

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "KozmosIcons",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
    },
    rollupOptions: {
      external: externals,
      output: {
        globals: {
          "lucide-react": "LucideReact",
          react: "React",
          "react/jsx-runtime": "ReactJsxRuntime",
        },
      },
    },
  },
});

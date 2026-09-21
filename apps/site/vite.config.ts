import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    // @kozmos/react is linked from the workspace and carries its own React for
    // its tests; one React instance must serve both, or hooks throw.
    dedupe: ["react", "react-dom"],
  },
  // Storybook holds 6006 and mapscale-review 5173.
  server: { port: 5180, strictPort: true },
  preview: { port: 5181, strictPort: true },
});

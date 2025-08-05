
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  if (mode === "development") {
    // Dynamically import ESM-only module to avoid require errors
    const { componentTagger } = await import("lovable-tagger");
    plugins.push(componentTagger());
  }

  return {
    base: "./",
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["electron", "fs", "path"],
    },
    build: {
      rollupOptions: {
        external: mode === "production" ? [] : ["electron", "fs", "path"],
        output: {
          format: "es"
        }
      },
      target: "esnext",
      minify: false
    },
    define: {
      global: "globalThis",
    }
  };
});

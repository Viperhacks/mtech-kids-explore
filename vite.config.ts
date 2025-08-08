import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig(async ({ mode }): Promise<{
  plugins: PluginOption[];
  base: string;
  server: { host: string; port: number };
  resolve: { alias: Record<string, string> };
  optimizeDeps: any;
  build: any;
}> => {
  const plugins: PluginOption[] = [react()];

  if (mode === "development") {
    // dynamic import ESM-only module here
    const { componentTagger } = await import("lovable-tagger");
    plugins.push(componentTagger());
  }

  return {
    base: "./",
    server: {
      host: "::",
      port: 8081,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        fs: "/@empty",
        path: "/@empty",
      },
    },
    optimizeDeps: {
      exclude: ["electron", "fs", "path"],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      rollupOptions: {
        external: ["fs", "path", "electron"],
      },
    },
  };
});

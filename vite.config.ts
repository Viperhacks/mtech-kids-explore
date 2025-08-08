
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
    const { componentTagger } = await import("lovable-tagger");
    plugins.push(componentTagger());
  }

  const isElectron = process.env.ELECTRON_IS_DEV === 'true' || mode === 'electron';

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
        // Only alias fs and path to empty for web builds, not electron
        ...(isElectron ? {} : {
          fs: "/@empty",
          path: "/@empty",
        }),
      },
    },
    optimizeDeps: {
      exclude: isElectron ? [] : ["electron", "fs", "path"],
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
      target: isElectron ? 'electron-renderer' : 'es2015',
      rollupOptions: {
        external: isElectron ? [] : ["fs", "path", "electron"],
        output: {
          format: isElectron ? 'es' : 'es',
        },
      },
    },
  };
});

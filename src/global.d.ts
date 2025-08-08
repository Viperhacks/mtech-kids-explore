// global.d.ts
export {};

declare global {
  interface Window {
    electron?: {
      getConfig: () => Promise<{ apiBaseUrl: string }>;
    };
  }
}

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    fsModuleCache: true,
    pool: "vmThreads",
    testTimeout: 15_000,
    server: {
      deps: {
        inline: [/svelte/],
      },
    },
  },
  resolve: {
    conditions: ["browser"],
    alias: {
      $lib: path.resolve(import.meta.dirname, "./src/lib"),
    },
  },
});

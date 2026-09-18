import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ["src/**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    fsModuleCache: true,
    pool: "vmThreads",
    poolOptions: {
      vmThreads: {
        maxThreads: 4,
        minThreads: 1,
      },
    },
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
      "@intinyagroup/tokens": path.resolve(
        import.meta.dirname,
        "../tokens/src/base.css",
      ),
    },
  },
});

import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ["src/lib/ssr-smoke.test.ts"],
    globals: true,
    environment: "node",
    pool: "forks",
    testTimeout: 15_000,
    server: {
      deps: {
        inline: [/svelte/],
      },
    },
  },
  resolve: {
    conditions: ["node"],
    alias: {
      $lib: path.resolve(import.meta.dirname, "./src/lib"),
      "@intinyagroup/tokens": path.resolve(
        import.meta.dirname,
        "../tokens/src/base.css",
      ),
    },
  },
});

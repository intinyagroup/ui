import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    fsModuleCache: true,
  },
  resolve: {
    alias: {
      $lib: path.resolve(import.meta.dirname, "./src/lib"),
    },
  },
});

import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

/**
 * Shared Vitest preset for all Svelte 5 packages in the monorepo.
 *
 * Usage in package vitest.config.ts:
 *   import { createPackageConfig } from "../../shared/vitest-preset";
 *   export default createPackageConfig(import.meta.dirname);
 */
export function createPackageConfig(
  packageDir: string,
  options?: { svelte?: boolean; additionalAlias?: Record<string, string> },
) {
  const useSvelte = options?.svelte !== false;
  const plugins = useSvelte ? [svelte()] : [];

  const alias: Record<string, string> = {
    $lib: path.resolve(packageDir, "./src/lib"),
  };

  if (options?.additionalAlias) {
    Object.assign(alias, options.additionalAlias);
  }

  return defineConfig({
    plugins,
    test: {
      include: ["src/**/*.test.ts"],
      globals: true,
      environment: "jsdom",
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
      alias,
    },
  });
}

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.svelte-kit/**",
      "**/build/**",
      "**/coverage/**",
      "**/*.d.ts",
      // Committed Storybook build output, not source.
      "**/storybook-static/**",
      ".beads/**",
      "pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    // TypeScript inside <script lang="ts"> and .svelte.ts rune modules must be
    // parsed by typescript-eslint via svelte-eslint-parser's sub-parser option.
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    // TypeScript-aware linting replaces no-undef; tsc resolves identifiers.
    files: ["**/*.ts", "**/*.svelte", "**/*.svelte.ts"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    // In .svelte files the base unused-vars rules cannot see template
    // references (well-known false positives with runes $props()/$state()).
    // tsc + svelte-check cover real unused code.
    files: ["**/*.svelte", "**/*.svelte.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "svelte/no-at-html-tags": "off",
      // Components intentionally build navigation targets; resolve() only
      // applies inside SvelteKit apps, not a component library.
      "svelte/no-navigation-without-resolve": "off",
      // Canvas/SVG primitives (Barcode, QRCode, charts) draw via direct DOM.
      "svelte/no-dom-manipulating": "off",
      // All 83 legacy loops now carry explicit keys; keep it enforced.
      "svelte/require-each-key": "error",
      "svelte/prefer-svelte-reactivity": "warn",
      "svelte/prefer-writable-derived": "warn",
      "svelte/no-unused-svelte-ignore": "warn",
    },
  },
  {
    // Legacy-era patterns kept visible but non-blocking for now.
    files: ["**/*.ts", "**/*.svelte", "**/*.svelte.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "no-useless-assignment": "warn",
    },
  },
  {
    files: ["**/*.ts", "**/*.svelte.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: [
      "scripts/**/*.mjs",
      "*.config.{js,ts,mjs}",
      "**/*.config.{js,ts,mjs}",
      "eslint.config.js",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);

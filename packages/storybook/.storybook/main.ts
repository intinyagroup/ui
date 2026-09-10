import type { StorybookConfig } from "@storybook/svelte-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|ts|svelte)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-links"],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
  viteFinal: async (config) => {
    const { svelte } = await import("@sveltejs/vite-plugin-svelte");
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(typeof config.resolve?.alias === "object"
            ? config.resolve.alias
            : {}),
          lowlight: "lowlight",
        },
      },
      plugins: [
        ...(config.plugins ?? []),
        svelte({ compilerOptions: { runes: false } }),
      ],
    };
  },
};

export default config;

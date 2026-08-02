/** @type {import('storybook').StorybookConfig} */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  svelte: {
    compilerOptions: {
      runes: true
    }
  }
};

export default config;

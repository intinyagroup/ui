import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|ts|svelte)'],
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
  },
  core: {
    builder: '@storybook/builder-vite'
  }
};

export default config;

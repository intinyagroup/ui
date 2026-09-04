import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('svelte-preprocess').Config} */
const config = {
  preprocess: vitePreprocess()
};

export default config;
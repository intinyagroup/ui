import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

const layoutPath = fileURLToPath(
	new URL('./src/routes/docs/_layout.svelte', import.meta.url)
);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx'],
			layout: layoutPath
		})
	],
	kit: {
		adapter: adapter({ fallback: 'index.html' }),
		alias: {
			$ui: '../core/src/lib'
		}
	}
};

export default config;

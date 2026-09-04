#!/usr/bin/env node
// Copy pagefind search assets from build/ into .svelte-kit/output/client/
// so `vite preview` (which serves from output/client) can reach them.
// pagefind writes to build/pagefind; SvelteKit preview serves .svelte-kit/output/client.
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const src = join(root, 'build', 'pagefind');
const dest = join(root, '.svelte-kit', 'output', 'client', 'pagefind');

if (!existsSync(src)) {
	console.warn('copy-pagefind: build/pagefind not found, skipping');
	process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log(`copy-pagefind: ${src} -> ${dest}`);
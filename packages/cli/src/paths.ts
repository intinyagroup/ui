import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Resolve the monorepo root from this compiled file's location. */
export function monorepoRoot(): string {
	// dist/index.js → packages/cli → repo root
	return join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
}

/** Locate a file by walking up from cwd (components.json, package.json). */
export function findUp(names: string[], start: string): string | undefined {
	let dir = start;
	for (;;) {
		for (const name of names) {
			const candidate = join(dir, name);
			if (existsSync(candidate)) return candidate;
		}
		const parent = dirname(dir);
		if (parent === dir) return undefined;
		dir = parent;
	}
}

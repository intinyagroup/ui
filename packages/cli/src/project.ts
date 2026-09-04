import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

export interface ProjectConfig {
	/** Absolute path to the consumer project root (where package.json lives). */
	root: string;
	/** Resolved absolute alias paths. */
	aliases: {
		components: string;
		utils: string;
		lib: string;
	};
	/** True if the project already has a components.json (shadcn-svelte compatible). */
	existing: boolean;
}

function findUp(names: string[], start: string): string | undefined {
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

const DEFAULT_ALIASES = {
	components: '$lib/components',
	utils: '$lib/utils',
	lib: '$lib',
};

/**
 * Detect the consumer project layout.
 *
 * Precedence:
 *   1. An existing components.json (shadcn-svelte style) in the project.
 *   2. A package.json at the current directory (SvelteKit default $lib aliases).
 *   3. Nearest package.json walking up.
 */
export function resolveProjectConfig(cwd: string): ProjectConfig {
	const componentsJson = findUp(['components.json'], cwd);
	if (componentsJson) {
		const raw = JSON.parse(readFileSync(componentsJson, 'utf8')) as {
			aliases?: { components?: string; utils?: string; lib?: string };
		};
		const aliases = raw.aliases ?? {};
		return {
			root: dirname(componentsJson),
			aliases: {
				components: aliases.components ?? DEFAULT_ALIASES.components,
				utils: aliases.utils ?? DEFAULT_ALIASES.utils,
				lib: aliases.lib ?? DEFAULT_ALIASES.lib,
			},
			existing: true,
		};
	}

	const pkgPath = findUp(['package.json'], cwd);
	if (pkgPath) {
		return {
			root: dirname(pkgPath),
			aliases: { ...DEFAULT_ALIASES },
			existing: false,
		};
	}

	return {
		root: cwd,
		aliases: { ...DEFAULT_ALIASES },
		existing: false,
	};
}

/** Map an alias like "$lib/components" to an absolute directory. */
export function resolveAliasDir(
	config: ProjectConfig,
	alias: string,
): string {
	if (!alias.startsWith('$lib')) {
		throw new Error(
			`Unsupported alias "${alias}" — Intinya CLI currently supports $lib-based aliases only.`,
		);
	}
	const suffix = alias.slice('$lib'.length).replace(/^\//, '');
	return join(config.root, 'src', 'lib', suffix);
}

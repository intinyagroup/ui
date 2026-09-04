import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

export type Framework = 'svelte' | 'react';

export interface ProjectConfig {
	/** Absolute path to the consumer project root (where package.json lives). */
	root: string;
	/** Framework detected or specified. */
	framework: Framework;
	/** Resolved absolute alias paths. */
	aliases: {
		components: string;
		utils: string;
		lib: string;
	};
	/** True if the project already has a components.json (shadcn compatible). */
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

const DEFAULT_SVELTE_ALIASES = {
	components: '$lib/components',
	utils: '$lib/utils',
	lib: '$lib',
};

const DEFAULT_REACT_ALIASES = {
	components: '@/components',
	utils: '@/lib/utils',
	lib: '@/lib',
};

/**
 * Detect the consumer project layout and framework.
 */
export function resolveProjectConfig(cwd: string, preferredFramework?: Framework): ProjectConfig {
	let framework: Framework = preferredFramework ?? 'svelte';

	const pkgPath = findUp(['package.json'], cwd);
	let root = cwd;
	if (pkgPath) {
		root = dirname(pkgPath);
		try {
			const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
				dependencies?: Record<string, string>;
				devDependencies?: Record<string, string>;
			};
			const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
			if (!preferredFramework) {
				if (allDeps['react'] || allDeps['react-dom'] || allDeps['next']) {
					framework = 'react';
				} else if (allDeps['svelte'] || allDeps['@sveltejs/kit']) {
					framework = 'svelte';
				}
			}
		} catch {
			// ignore JSON error
		}
	}

	const componentsJson = findUp(['components.json'], cwd);
	if (componentsJson) {
		try {
			const raw = JSON.parse(readFileSync(componentsJson, 'utf8')) as {
				framework?: Framework;
				aliases?: { components?: string; utils?: string; lib?: string };
			};
			const aliases = raw.aliases ?? {};
			const detectedFramework = raw.framework ?? framework;
			const defaults = detectedFramework === 'react' ? DEFAULT_REACT_ALIASES : DEFAULT_SVELTE_ALIASES;
			return {
				root: dirname(componentsJson),
				framework: detectedFramework,
				aliases: {
					components: aliases.components ?? defaults.components,
					utils: aliases.utils ?? defaults.utils,
					lib: aliases.lib ?? defaults.lib,
				},
				existing: true,
			};
		} catch {
			// fallback
		}
	}

	const defaults = framework === 'react' ? DEFAULT_REACT_ALIASES : DEFAULT_SVELTE_ALIASES;
	return {
		root,
		framework,
		aliases: { ...defaults },
		existing: false,
	};
}

/** Map an alias like "$lib/components" or "@/components" to an absolute directory. */
export function resolveAliasDir(
	config: ProjectConfig,
	alias: string,
): string {
	if (alias.startsWith('$lib')) {
		const suffix = alias.slice('$lib'.length).replace(/^\//, '');
		return join(config.root, 'src', 'lib', suffix);
	}
	if (alias.startsWith('@/')) {
		const suffix = alias.slice(2);
		// Check src directory structure vs flat
		const hasSrc = existsSync(join(config.root, 'src'));
		return hasSrc ? join(config.root, 'src', suffix) : join(config.root, suffix);
	}
	return join(config.root, alias);
}

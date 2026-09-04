import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { loadRegistry, resolveWithDeps, type RegistryComponent } from './registry.js';
import { resolveProjectConfig } from './project.js';
import { rewriteComponentSource, componentTargetPath, coreSourcePath } from './write.js';
import { syncDependencies } from './install.js';
import { monorepoRoot } from './paths.js';

/** True if the component is installed in the consumer project. */
export function isInstalled(root: string, name: string): boolean {
	return existsSync(join(root, 'src', 'lib', 'components', name));
}

/**
 * Update installed components to the latest registry version.
 * Only rewrites files whose content differs from the latest source.
 */
export async function updateComponents(
	names: string[],
	opts: { all: boolean; cwd: string },
): Promise<{
	updated: string[];
	added: string[];
	upToDate: string[];
	missing: string[];
	addedDeps: Record<string, string>;
}> {
	const registry = await loadRegistry();
	const byName = new Map(registry.components.map((c) => [c.name, c]));
	const config = resolveProjectConfig(opts.cwd);

	let targets: string[];
	if (opts.all) {
		targets = registry.components
			.map((c) => c.name)
			.filter((n) => isInstalled(config.root, n));
	} else {
		const unknown = names.filter((n) => !byName.has(n));
		if (unknown.length > 0) {
			throw new Error(
				`Unknown component${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}`,
			);
		}
		targets = names;
	}

	const missing = targets.filter((n) => !isInstalled(config.root, n));
	const toUpdate = targets.filter((n) => isInstalled(config.root, n));

	const resolved: RegistryComponent[] = [];
	for (const name of toUpdate) {
		for (const comp of resolveWithDeps(registry, name)) {
			if (!resolved.some((c) => c.name === comp.name)) resolved.push(comp);
		}
	}

	const updated: string[] = [];
	const added: string[] = [];
	const upToDate: string[] = [];
	const mono = monorepoRoot();

	for (const comp of resolved) {
		for (const entry of comp.files) {
			const srcPath = coreSourcePath(mono, entry);
			const target = componentTargetPath(config.root, entry);
			const targetRel = relative(config.root, target);
			if (!existsSync(srcPath)) continue;
			const latest = rewriteComponentSource(
				readFileSync(srcPath, 'utf8'),
				{
					root: config.root,
					aliases: config.aliases,
					overwrite: true,
				},
			);
			if (!existsSync(target)) {
				mkdirSync(dirname(target), { recursive: true });
				writeFileSync(target, latest);
				added.push(targetRel);
				continue;
			}
			if (readFileSync(target, 'utf8') !== latest) {
				mkdirSync(dirname(target), { recursive: true });
				writeFileSync(target, latest);
				updated.push(targetRel);
			} else {
				upToDate.push(targetRel);
			}
		}
	}

	const { added: addedDeps } = syncDependencies(
		config.root,
		registry,
		resolved.map((c) => c.name),
	);

	return { updated, added, upToDate, missing, addedDeps };
}

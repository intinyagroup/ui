import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadRegistry, resolveWithDeps, type Registry } from './registry.js';
import { resolveProjectConfig } from './project.js';
import { writeComponent, type WriteOptions } from './write.js';
import { monorepoRoot } from './paths.js';

const PKG_JSON = 'package.json';

function readJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

/**
 * Merge the package dependencies required by a component set into the
 * consumer project's package.json.
 */
export function syncDependencies(
	projectRoot: string,
	registry: Registry,
	components: string[],
): { added: Record<string, string>; hasPackageJson: boolean } {
	const pkgPath = join(projectRoot, PKG_JSON);
	if (!existsSync(pkgPath)) {
		return { added: {}, hasPackageJson: false };
	}

	// Map every registry component to its runtime deps. v3 registries embed
	// the source package's dependencies (packageDeps); older registries fall
	// back to reading the monorepo package.json.
	const depMap = new Map<string, Record<string, string>>();
	for (const comp of registry.components) {
		const embedded = comp.packageDeps;
		if (embedded) {
			depMap.set(comp.name, embedded);
			continue;
		}
		const pj = join(monorepoRoot(), 'packages', comp.package ?? 'core', PKG_JSON);
		const deps = existsSync(pj)
			? readJson<{ dependencies?: Record<string, string> }>(pj).dependencies ?? {}
			: {};
		depMap.set(comp.name, deps);
	}

	// Resolve workspace:* specs to concrete versions so consumers installing
	// from npm can resolve them (workspace:* is pnpm-only).
	const resolveWorkspace = (spec: string): string => {
		if (!spec.startsWith('workspace:')) return spec;
		const rest = spec.slice('workspace:'.length);
		// workspace:^x.y.z -> ^x.y.z (keep range); wildcard falls back to 'latest'
		return rest === '*' || rest === '~' || rest === '^' ? 'latest' : rest;
	};
	const pkg = readJson<{ dependencies?: Record<string, string> }>(pkgPath);
	const deps = pkg.dependencies ?? {};
	const added: Record<string, string> = {};
	for (const name of components) {
		const required = depMap.get(name) ?? {};
		for (const [dep, version] of Object.entries(required)) {
			if (deps[dep] === undefined && added[dep] === undefined) {
				added[dep] = resolveWorkspace(version);
			}
		}
		pkg.dependencies = { ...deps, ...added };
		writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
	}
	return { added, hasPackageJson: true };
}

/**
 * Install a component into the consumer project.
 * Returns the list of all resolved component names (root + deps).
 */
export async function installComponents(
	names: string[],
	opts: { overwrite: boolean; cwd: string },
): Promise<{ installed: string[]; written: string[]; skipped: string[]; addedDeps: Record<string, string> }> {
	const registry = await loadRegistry();
	const resolved: string[] = [];
	for (const name of names) {
		const chain = resolveWithDeps(registry, name);
		for (const comp of chain) {
			if (!resolved.includes(comp.name)) resolved.push(comp.name);
		}
	}

	const config = resolveProjectConfig(opts.cwd);
	const writeOpts: WriteOptions = {
		root: config.root,
		aliases: config.aliases,
		overwrite: opts.overwrite,
	};

	const allWritten: string[] = [];
	const allSkipped: string[] = [];
	for (const name of resolved) {
		const comp = registry.components.find((c) => c.name === name);
		if (!comp) continue;
		const res = writeComponent(comp, writeOpts, monorepoRoot());
		allWritten.push(...res.written);
		allSkipped.push(...res.skipped);
	}

	const { added } = syncDependencies(config.root, registry, resolved);

	return {
		installed: resolved,
		written: allWritten,
		skipped: allSkipped,
		addedDeps: added,
	};
}

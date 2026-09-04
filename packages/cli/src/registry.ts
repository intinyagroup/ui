import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface RegistryProp {
	name: string;
	type?: string;
	default?: string | number | boolean;
	values?: string[];
	description?: string;
}

export interface RegistryComponent {
	name: string;
	description?: string;
	category?: string;
	tags?: string[];
	files: string[];
	/** Embedded file contents (registry v3) — keyed by files[] entry. */
	contents?: Record<string, string>;
	/** Embedded runtime deps (registry v3) from the source package. */
	packageDeps?: Record<string, string>;
	deps: string[];
	main?: string;
	mainTs?: string;
	isComponent: boolean;
	entry?: string;
	props?: RegistryProp[];
	/** Source package in the monorepo (core|md3|flat); defaults to core. */
	package?: string;
}

export interface Registry {
	schema: string;
	generatedAt: string;
	components: RegistryComponent[];
}

const DEFAULT_LOCAL_REGISTRY = fileURLToPath(
	new URL('../registry/index.json', import.meta.url),
);

/**
 * Load the component registry.
 *
 * Resolution order:
 *   1. $INTINYA_REGISTRY env — path to a local JSON file, or a URL.
 *   2. Local registry shipped with the CLI (packages/cli/registry/index.json).
 */
export async function loadRegistry(): Promise<Registry> {
	const override = process.env.INTINYA_REGISTRY;
	if (override) {
		if (/^https?:\/\//.test(override)) {
			const res = await fetch(override);
			if (!res.ok) {
				throw new Error(
					`Failed to fetch registry from ${override}: ${res.status} ${res.statusText}`,
				);
			}
			return (await res.json()) as Registry;
		}
		if (existsSync(override)) {
			return JSON.parse(readFileSync(override, 'utf8')) as Registry;
		}
		throw new Error(`INTINYA_REGISTRY points to a missing file: ${override}`);
	}

	if (!existsSync(DEFAULT_LOCAL_REGISTRY)) {
		throw new Error('Local registry not found. Run `pnpm generate:registry` first.');
	}
	return JSON.parse(readFileSync(DEFAULT_LOCAL_REGISTRY, 'utf8')) as Registry;
}

/** Normalize a component name for lookup: "FAB" / "fab" / "FaB" -> "fab", "BlobCard" -> "blobcard". */

function normalizeName(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Resolve a component and its transitive dependency closure (BFS). */
export function resolveWithDeps(
	registry: Registry,
	root: string,
): RegistryComponent[] {
	const byName = new Map(registry.components.map((c) => [c.name, c]));
	const byNorm = new Map(
		registry.components.map((c) => [normalizeName(c.name), c.name]),
	);
	const seen = new Set<string>();
	const out: RegistryComponent[] = [];
	const queue = [root];
	while (queue.length > 0) {
		const raw = queue.shift()!;
		if (seen.has(raw)) continue;
		let name = raw;
		let comp = byName.get(name);
		if (!comp) {
			// Case-insensitive / kebab-insensitive lookup (FAB, fab, fab-button...)
			const canonical = byNorm.get(normalizeName(name));
			if (canonical) {
				name = canonical;
				comp = byName.get(name);
			}
		}
		if (!comp) {
			throw new Error(`Unknown component: ${raw}`);
		}
		seen.add(name);
		out.push(comp);
		// utils and other shared lib files are not registry components
		for (const dep of comp.deps) {
			if (dep !== 'utils' && !seen.has(dep) && byName.has(dep)) queue.push(dep);
		}
	}
	return out;
}

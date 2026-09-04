import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const TOKENS_PKG = '@intinyagroup/tokens';
const TOKENS_VERSION = '^0.1.0-alpha.5';
const CN_DEPS = { clsx: '^2.1.1', 'tailwind-merge': '^3.5.0' } as const;

const DEFAULT_COMPONENTS_JSON = {
	$schema: 'https://intinya-digital-asia.github.io/ui/schema.json',
	style: 'default',
	tailwind: {
		config: '',
		css: 'src/app.css',
	},
	aliases: {
		components: '$lib/components',
		utils: '$lib/utils',
		ui: '$lib/components/ui',
		lib: '$lib',
	},
};

export type ProjectType = 'SvelteKit' | 'Svelte' | 'Vite' | 'other';

interface PkgLike {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

/** Detect the consumer framework from a package.json manifest. */
export function detectProjectType(pkg: PkgLike): ProjectType {
	const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	if (all['@sveltejs/kit']) return 'SvelteKit';
	if (all['svelte']) return 'Svelte';
	if (all['vite']) return 'Vite';
	return 'other';
}

/** Walk up from a directory looking for a file name (package.json, …). */
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

/** Resolve the consumer project root (nearest package.json walking up). */
export function projectRoot(cwd: string): string {
	const pkg = findUp(['package.json'], cwd);
	return pkg ? dirname(pkg) : cwd;
}

/** Pick the project's main CSS entry, preferring existing files. */
function resolveCssPath(root: string, configured?: string): string {
	if (configured) {
		if (configured.startsWith('src/')) return join(root, 'src', configured.slice(4));
		return join(root, configured);
	}
	const candidates = ['src/app.css', 'src/styles.css', 'src/app.pcss', 'src/styles.pcss'];
	for (const c of candidates) {
		if (existsSync(join(root, c))) return c;
	}
	return join(root, 'src/app.css');
}

const CN_IMPORT = `import { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n`;

const CN_FN = `export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
`;

export interface InitResult {
	projectRoot: string;
	projectType: ProjectType;
	componentsJson: 'created' | 'updated' | 'error';
	cssPath: string | null;
	cssTouched: boolean;
	utilsPath: string | null;
	utilsCreated: boolean;
	depsAdded: string[];
}

/**
 * Initialize Intinya in a consumer project:
 *   1. Detect framework.
 *   2. Create/update components.json.
 *   3. Add @intinyagroup/tokens (+ cn() runtime deps) to package.json.
 *   4. Import tokens in the project's main CSS.
 *   5. Create a cn() utils file if missing.
 */
export function initProject(cwd: string): InitResult {
	const root = projectRoot(cwd);

	const pkgPath = join(root, 'package.json');
	const pkg = existsSync(pkgPath)
		? (JSON.parse(readFileSync(pkgPath, 'utf8')) as PkgLike)
		: {};
	const projectType = detectProjectType(pkg);

	// 1. components.json
	const componentsPath = join(root, 'components.json');
	const existing = existsSync(componentsPath);
	let componentsJson: 'created' | 'updated' | 'error' = 'created';
	let cssConfigured: string | undefined;
	try {
		let cfg: typeof DEFAULT_COMPONENTS_JSON;
		if (existing) {
			const raw = JSON.parse(readFileSync(componentsPath, 'utf8')) as Partial<
				typeof DEFAULT_COMPONENTS_JSON
			> & { tailwind?: { config?: string; css?: string } };
			cfg = structuredClone(DEFAULT_COMPONENTS_JSON);
			if (raw.$schema) cfg.$schema = raw.$schema;
			if (raw.style) cfg.style = raw.style;
			if (raw.tailwind?.config) cfg.tailwind.config = raw.tailwind.config;
			if (raw.tailwind?.css) cfg.tailwind.css = raw.tailwind.css;
			if (raw.aliases && Object.keys(raw.aliases).length > 0) {
				cfg.aliases = { ...cfg.aliases, ...raw.aliases };
			}
			cssConfigured = cfg.tailwind.css;
		} else {
			cfg = structuredClone(DEFAULT_COMPONENTS_JSON);
			cssConfigured = cfg.tailwind.css;
		}
		writeFileSync(componentsPath, JSON.stringify(cfg, null, 2) + '\n');
		componentsJson = existing ? 'updated' : 'created';
	} catch {
		componentsJson = 'error';
	}

	// 2. dependencies
	const depsAdded: string[] = [];
	if (existsSync(pkgPath)) {
		const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
			dependencies?: Record<string, string>;
		};
		const deps = pkgJson.dependencies ?? {};
		const needed = { [TOKENS_PKG]: TOKENS_VERSION, ...CN_DEPS };
		for (const [dep, v] of Object.entries(needed)) {
			if (deps[dep] === undefined) {
				deps[dep] = v;
				depsAdded.push(dep);
			}
		}
		if (depsAdded.length > 0) {
			pkgJson.dependencies = { ...deps };
			writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
		}
	}

	// 3. token import in CSS
	const cssPath = resolveCssPath(root, cssConfigured);
	let cssTouched = false;
	if (existsSync(cssPath)) {
		const css = readFileSync(cssPath, 'utf8');
		if (!css.includes(TOKENS_PKG)) {
			const importLine = `@import "${TOKENS_PKG}";\n\n`;
			writeFileSync(cssPath, importLine + css);
			cssTouched = true;
		}
	}

	// 4. cn() utils
	const utilsPath = join(root, 'src', 'lib', 'utils.ts');
	let utilsCreated = false;
	if (!existsSync(utilsPath)) {
		mkdirSync(dirname(utilsPath), { recursive: true });
		writeFileSync(utilsPath, `${CN_IMPORT}\n${CN_FN}`);
		utilsCreated = true;
	}

	return {
		projectRoot: root,
		projectType,
		componentsJson,
		cssPath,
		cssTouched,
		utilsPath: utilsCreated ? utilsPath : null,
		utilsCreated,
		depsAdded,
	};
}

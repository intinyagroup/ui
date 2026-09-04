import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import MagicString from 'magic-string';
import type { RegistryComponent } from './registry.js';

export interface WriteOptions {
	root: string;
	aliases: { components: string; utils: string; lib: string };
	overwrite: boolean;
}

/** Absolute target path for a component file entry in the consumer project. */
export function componentTargetPath(root: string, entry: string): string {
	return join(root, 'src', 'lib', 'components', ...entry.split('/'));
}

/** Absolute source path inside the monorepo for a component file entry.
 * Registry components carry their source package (core|md3|flat). */
export function coreSourcePath(
	monorepoRoot: string,
	entry: string,
	pkg = 'core',
): string {
	return join(
		monorepoRoot,
		'packages',
		pkg,
		'src',
		'lib',
		'components',
		...entry.split('/'),
	);
}

const IMPORT_RE =
	/(import\s+(?:[\w$*{},\s]+?\s+from\s+)?)(['"])([^'"]+)\2/g;

/**
 * Rewrite a component source so it works outside the monorepo:
 *   - "$lib/components/<name>/..." → "<alias>/components/<name>/..."
 *   - "$lib/utils.js" / "$lib/utils.ts" → "<alias>.js"
 *   - "$lib/i18n/index.ts" → "<lib>/i18n/index.js"
 *   - duplicate identical imports are de-duplicated
 *
 * Relative imports ("./x.svelte") and bare module imports are kept as-is.
 */
export function rewriteComponentSource(
	source: string,
	opts: WriteOptions,
): string {
	const s = new MagicString(source);
	const seenBare = new Set<string>();
	let match: RegExpExecArray | null;
	while ((match = IMPORT_RE.exec(source)) !== null) {
		const prefix = match[1];
		const quote = match[2];
		const spec = match[3];
		const start = match.index;
		const end = IMPORT_RE.lastIndex;
		if (spec.startsWith('$lib/')) {
			const rel = spec.slice('$lib/'.length);
			const isUtils = rel === 'utils.js' || rel === 'utils.ts';
			const isI18n = rel === 'i18n/index.js' || rel === 'i18n/index.ts';
			const newSpec = isUtils
				? opts.aliases.utils.endsWith('.js') || opts.aliases.utils.endsWith('.ts')
					? opts.aliases.utils
					: `${opts.aliases.utils}.js`
				: isI18n
					? `${opts.aliases.lib}/${rel.replace(/\.ts$/, '.js')}`
					: `${opts.aliases.components}/${rel.replace(/^components\//, '').replace(/\.ts$/, '.js')}`;
		}

		if (!spec.startsWith('.')) {
			if (seenBare.has(spec)) {
				// drop the whole duplicate import line
				const lineStart = source.lastIndexOf('\n', start) + 1;
				const lineEnd = source.indexOf('\n', end);
				s.remove(lineStart, lineEnd === -1 ? source.length : lineEnd);
			} else {
				seenBare.add(spec);
			}
		}
	}

	return s.toString();
}

/** Absolute source path inside the monorepo core package for shared lib files. */
export function sharedLibSourcePath(
	monorepoRoot: string,
	relPath: string,
): string {
	return join(monorepoRoot, 'packages', 'core', 'src', 'lib', ...relPath.split('/'));
}

/**
 * Shared lib files (e.g. i18n/) referenced by components via `$lib/…` imports.
 * Written into the consumer project's lib dir; shared across components.
 */
const SHARED_LIB_FILES: Record<string, string[]> = {
	i18n: [
		'i18n/locale.svelte.ts',
		'i18n/LocaleProvider.svelte',
		'i18n/index.ts',
	],
};

/** Write the component files into the consumer project.
 * Sources come from the registry's embedded contents (v3) so the CLI
 * works from npm without the monorepo source tree. Falls back to reading
 * from the monorepo when contents are absent (v2 registries). */
export function writeComponent(
	component: RegistryComponent,
	opts: WriteOptions,
	monorepoRoot: string,
): { written: string[]; skipped: string[] } {
	const written: string[] = [];
	const skipped: string[] = [];
	const contents = component.contents;
	for (const entry of component.files) {
		const target = componentTargetPath(opts.root, entry);
		const targetRel = relative(opts.root, target);

		if (existsSync(target) && !opts.overwrite) {
			skipped.push(targetRel);
			continue;
		}
		const source = contents?.[entry] ?? readFileSync(
			coreSourcePath(monorepoRoot, entry, component.package),
			'utf8',
		);
		const rewritten = rewriteComponentSource(source, opts);
		mkdirSync(dirname(target), { recursive: true });
		writeFileSync(target, rewritten);
		written.push(targetRel);
	}
	for (const dep of component.deps) {
		const shared = SHARED_LIB_FILES[dep];
		if (!shared) continue;
		for (const file of shared) {
			const target = join(opts.root, 'src', 'lib', file);
			const targetRel = relative(opts.root, target);
			if (existsSync(target) && !opts.overwrite) {
				skipped.push(targetRel);
				continue;
			}
			const source = readFileSync(sharedLibSourcePath(monorepoRoot, file), 'utf8');
			const rewritten = rewriteComponentSource(source, opts);
			mkdirSync(dirname(target), { recursive: true });
			writeFileSync(target, rewritten);
			written.push(targetRel);
		}
	}
	return { written, skipped };
}

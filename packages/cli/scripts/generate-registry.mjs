#!/usr/bin/env node
/**
 * Registry generator (v2).
 * Scans packages/{core,md3,flat}/src/lib/components/* and emits
 * packages/cli/registry/index.json — one entry per component with its
 * source files, transitive $lib dependencies, and rich metadata
 * (category, tags, description, props) for editor/marketplace use.
 *
 * $lib import aliases are mapped per-package (md3/flat components
 * import their own utils via $lib too), so each component's relative
 * files are computed against its own package root.
 *
 * Usage: node scripts/generate-registry.mjs
 *        (run from packages/cli, or pass repo root as argv[2])
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative, sep, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = process.argv[2] ?? join(here, '..', '..', '..');
const SCAN_PACKAGES = ['core', 'md3', 'flat'];
const PKG_DIRS = SCAN_PACKAGES.map((p) => ({
	package: p,
	dir: join(repoRoot, 'packages', p, 'src', 'lib', 'components'),
}));
const outPath = join(repoRoot, 'packages', 'cli', 'registry', 'index.json');

const SVELTE_RE = /<script[^>]*>[\s\S]*?<\/script>/g;
const IMPORT_RE = /import\s+(?:[\w$*{},\s]+?\s+from\s+)?['"]([^'"]+)['"]/g;
const KNOWN_RE =
	/^svelte(?:\/|$)|^bits-ui(?:\/|$)|^lucide-svelte(?:\/|$)|^@lucide\/svelte(?:\/|$)|^tailwind-merge|^clsx|^tailwind-variants|^sveltekit-superforms|^formsnap|^@internationalized\/date|^chart\.js|^@tanstack\/table-core|^@tanstack\/svelte-virtual|^\.\/|^\.\.\//;
const IGNORE_SET = new Set([
	'svelte/elements',
	'svelte/transition',
	'svelte/animate',
	'svelte/motion',
	'svelte/store',
	'svelte/events',
	'svelte/legacy',
]);

// ---------------------------------------------------------------------------
// Categories — matched by component directory name; unknown names fall back
// to "uncategorized".
// ---------------------------------------------------------------------------
// Kebbab-case name → category map.
// Covers core, md3, and flat components.
const CATEGORIES = {
	actions: [
		'button', 'fab',
	],
	layout: [
		'card', 'aside', 'section', 'divider', 'aspect-ratio', 'scroll-area',
		'resizable', 'details', 'figure', 'separator', 'flex', 'box', 'grid',
		'stack',
	],
	navigation: [
		'tabs', 'accordion', 'breadcrumb', 'pagination', 'navigation-menu',
		'sidebar', 'drawer', 'dropdown-menu', 'menubar', 'tabbar',
		'slide-menu', 'slidemenu', 'navigation-bar', 'navigation-rail', 'top-app-bar',
	],
	forms: [
		'input', 'textarea', 'select', 'checkbox', 'radio-group', 'radio',
		'slider', 'label', 'form', 'input-group', 'number-input', 'otp-input',
		'date-picker', 'datetime-picker', 'color-picker', 'password-input',
		'search-select', 'combobox', 'rating', 'toggle', 'toggle-group',
		'switch', 'segmented-button', 'segmentedcontrol', 'search-bar',
		'text-field', 'time-picker', 'editable-label', 'chip',
	],
	feedback: [
		'alert', 'alert-dialog', 'dialog', 'toast', 'tooltip', 'popover',
		'sheet', 'bottom-sheet', 'snackbar', 'ripple', 'mobile-toast',
		'notification', 'status-indicator', 'live-badge',
	],
	'data-display': [
		'table', 'badge', 'badge-md3', 'avatar', 'avatar-group', 'timeline',
		'tree-view', 'stats-counter', 'stat-card', 'code-block',
		'markdown-renderer', 'progress', 'data-table', 'avatarstack',
		'calendar', 'charts', 'heatmap', 'barcode', 'qr-code',
		'progress-indicator', 'virtual-list', 'clipboard', 'progress-steps',
	],
	marketing: [
		'hero', 'pricing-card', 'pricing-table', 'testimonial',
		'testimonial-carousel', 'feature-grid', 'cta-section', 'stats',
		'logo-cloud', 'section-header', 'navbar', 'footer',
	],
	composite: [
		'carousel', 'bento-grid', 'stepper', 'command', 'context-menu',
		'hover-card', 'collapsible', 'empty-state', 'file-uploader',
		'signature-pad', 'kanban', 'comment', 'mention', 'reaction-bar',
		'user-profile-card', 'gallery', 'split-view',
	],
	mobile: [
		'actionsheet', 'fabmenu', 'pulltorefresh', 'swipeableitem',
		'listview', 'infinite-scroll', 'camera', 'gyroscope',
	],
	'flat-shape': [
		'blob-card', 'hexagon-grid', 'diamond-badge', 'wave-section',
		'pentagon-stat', 'star-card', 'triangle-alert', 'circle-avatar',
		'arrow-card', 'circle-grid', 'cross-badge', 'ellipse-badge',
		'octagon-card', 'parallelogram-card', 'trapezoid-card', 'zigzag-divider',
	],
	utility: [
		'skeleton', 'copy-to-clipboard', 'emoji', 'validate', 'main',
	],
};

/** Kebab-case a name so PascalCase md3/flat names match lowercase lists.
 * FAB -> fab (acronyms stay together), BlobCard -> blob-card. */
function kebab(name) {
	const acronym = /^[A-Z]{2,}$/.test(name);
	if (acronym) return name.toLowerCase();
	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

function categoryOf(name) {
	const k = kebab(name);
	for (const [cat, list] of Object.entries(CATEGORIES)) {
		if (list.includes(k)) return cat;
	}
	return 'uncategorized';
}

function tagsOf(name, category) {
	const tokens = name.split('-').filter((t) => t.length >= 2);
	return [...new Set([category, ...tokens])];
}

function titleCase(name) {
	return name
		.split('-')
		.map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
		.join(' ');
}

function simpleDescription(name) {
	return `${name.split('-').map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s)).join(' ')} component`;
}

// ---------------------------------------------------------------------------
// Small tokenizer helpers (best-effort, quote/brace aware).
// ---------------------------------------------------------------------------

function splitTopLevel(str) {
	const out = [];
	let depth = 0;
	let quote = null;
	let start = 0;
	for (let i = 0; i < str.length; i++) {
		const ch = str[i];
		if (quote) {
			if (ch === '\\') i++;
			else if (ch === quote) quote = null;
			continue;
		}
		if (ch === '"' || ch === "'" || ch === '`') quote = ch;
		else if (ch === '{' || ch === '[' || ch === '(') depth++;
		else if (ch === '}' || ch === ']' || ch === ')') depth--;
		else if ((ch === ',' || ch === ';') && depth === 0) {
			out.push(str.slice(start, i).trim());
			start = i + 1;
		}
	}
	const tail = str.slice(start).trim();
	if (tail) out.push(tail);
	return out;
}

function matchBlock(str, openIdx) {
	const open = str[openIdx];
	const close = { '{': '}', '[': ']', '(': ')' }[open];
	if (!close) return null;
	let depth = 0;
	let quote = null;
	for (let i = openIdx; i < str.length; i++) {
		const ch = str[i];
		if (quote) {
			if (ch === '\\') i++;
			else if (ch === quote) quote = null;
			continue;
		}
		if (ch === '"' || ch === "'" || ch === '`') quote = ch;
		else if (ch === open) depth++;
		else if (ch === close) {
			depth--;
			if (depth === 0) return { start: openIdx, end: i };
		}
	}
	return null;
}

function splitObject(obj) {
	// obj is a string starting/ending with {} (or not). Return key:value pairs.
	const trimmed = obj.trim();
	const inner =
		trimmed.startsWith('{') && trimmed.endsWith('}')
			? trimmed.slice(1, -1)
			: trimmed;
	return splitTopLevel(inner);
}

function firstColon(str) {
	let depth = 0;
	let quote = null;
	for (let i = 0; i < str.length; i++) {
		const ch = str[i];
		if (quote) {
			if (ch === '\\') i++;
			else if (ch === quote) quote = null;
			continue;
		}
		if (ch === '"' || ch === "'" || ch === '`') quote = ch;
		else if (ch === '{' || ch === '[' || ch === '(') depth++;
		else if (ch === '}' || ch === ']' || ch === ')') depth--;
		else if (ch === ':' && depth === 0) return i;
	}
	return -1;
}

function parseKeyValues(obj) {
	const out = new Map();
	for (const pair of splitObject(obj)) {
		const c = firstColon(pair);
		if (c === -1) continue;
		out.set(pair.slice(0, c).trim(), pair.slice(c + 1).trim());
	}
	return out;
}

function unquote(v) {
	const m = String(v).match(/^(['"`])([\s\S]*)\1$/);
	return m ? m[2] : v;
}

// Extract { variantName: { key: value, ... }, ... } from a tv `variants` body.
function parseVariantsObject(variantsBody) {
	const map = new Map();
	for (const pair of splitObject(variantsBody)) {
		const c = firstColon(pair);
		if (c === -1) continue;
		const variantName = unquote(pair.slice(0, c).trim());
		const openBrace = pair.indexOf('{', c);
		const block = openBrace === -1 ? null : matchBlock(pair, openBrace);
		const values = block
			? splitObject(pair.slice(openBrace + 1, block.end))
					.map((m) => {
						const cc = firstColon(m);
						return cc === -1 ? null : unquote(m.slice(0, cc).trim());
					})
					.filter(Boolean)
			: [];
		map.set(variantName, { values });
	}
	return map;
}

// Collect tv() variant definitions across script blocks.
// Returns Map<variantName, { values: string[], def: string | undefined }>.
function parseTvDefinitions(scripts) {
	const variants = new Map();
	for (const script of scripts) {
		let idx = 0;
		while ((idx = script.indexOf('tv(', idx)) !== -1) {
			const block = matchBlock(script, idx + 3);
			if (block) {
				const args = script.slice(idx + 4, block.end);
				for (const pair of splitObject(args)) {
					const c = firstColon(pair);
					if (c === -1) continue;
					const key = pair.slice(0, c).trim();
					const val = pair.slice(c + 1).trim();
					if (key === 'variants') {
						for (const [vn, data] of parseVariantsObject(val)) {
							if (!variants.has(vn)) {
								variants.set(vn, { values: data.values, def: undefined });
							} else if (variants.get(vn).values.length === 0) {
								variants.get(vn).values = data.values;
							}
						}
					} else if (key === 'defaultVariants') {
						for (const [k, v] of parseKeyValues(val)) {
							const entry = variants.get(k);
							if (entry) entry.def = unquote(v);
						}
					}
				}
			}
			idx = block ? block.end + 1 : idx + 3;
		}
	}
	return variants;
}

function literalDefault(expr) {
	if (expr == null) return undefined;
	let s = String(expr).trim();
	if (s.startsWith('$bindable(')) s = s.slice('$bindable('.length, -1).trim();
	if (s === 'undefined' || s === '') return undefined;
	const quoted = s.match(/^(['"`])([\s\S]*)\1$/);
	if (quoted) return quoted[2];
	if (s === 'true') return true;
	if (s === 'false') return false;
	if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
	return undefined; // array/object/function references — no static default
}

function cleanType(type) {
	if (!type) return undefined;
	const t = type.trim();
	if (!t) return undefined;
	if (t.startsWith('{') || t.startsWith('[') || t.startsWith('(')) return 'any';
	return t;
}

function extractJsdoc(pair) {
	const m = pair.match(/\/\*\*([\s\S]*?)\*\//);
	if (!m) return undefined;
	const clean = m[1]
		.split('\n')
		.map((l) => l.replace(/^\s*\*+\s?/, '').trim())
		.filter(Boolean)
		.filter((l) => !l.startsWith('@'))
		.join(' ')
		.trim();
	return clean || undefined;
}

// Extract the `let { ... } = $props()` destructure from a script block.
// Returns { members: string[], typeAnnotation: string[] | string | null }.
function findDestructure(script) {
	const idx = script.indexOf('$props()');
	if (idx === -1) return null;
	const prefix = script.slice(0, idx);
	const m = [...prefix.matchAll(/let\s*\{/g)].at(-1);
	if (!m) return null;
	const openIdx = m.index + m[0].indexOf('{');
	const body = matchBlock(script, openIdx);
	if (!body) return null;
	const members = splitTopLevel(script.slice(openIdx + 1, body.end));
	let typeAnnotation = null;
	const after = script.slice(body.end + 1, idx);
	if (after.startsWith(':')) {
		const flat = after.slice(1).trim();
		if (flat.startsWith('{')) {
			const openBrace = after.indexOf('{');
			const tblock = matchBlock(after, openBrace);
			if (tblock) {
				typeAnnotation = splitObject(after.slice(tblock.start + 1, tblock.end));
			}
		} else {
			const eq = flat.indexOf('=');
			typeAnnotation = flat.slice(0, eq === -1 ? flat.length : eq).trim();
		}
	}
	return { members, typeAnnotation };
}

function findDescription(script) {
	const m = script.match(/\/\*\*([\s\S]*?)\*\//);
	if (!m) return null;
	const lines = m[1]
		.split('\n')
		.map((l) => l.replace(/^\s*\*\s*/, '').trim())
		.filter(Boolean)
		.filter((l) => !l.startsWith('@'));
	const text = lines.join(' ');
	return text || null;
}

// Extract props metadata (name, type, default, values, description) from a
// component file. Best-effort — returns [] on failure.
function extractProps(fileCode, variants) {
	const scripts = collectScripts(fileCode);
	if (scripts.length === 0) return [];

	const instance = scripts.find((s) => s.includes('$props()')) ?? scripts.at(-1);
	const exp = findDestructure(instance);
	if (!exp) return [];

	// Inline object type annotation: { name?: Type; ... }
	const typeMap = new Map();
	if (Array.isArray(exp.typeAnnotation)) {
		for (const pair of exp.typeAnnotation) {
			const optional = pair.includes('?');
			const c = firstColon(pair);
			const rawName = c === -1 ? pair.replace('?', '').trim() : pair.slice(0, c).trim();
			const type = c === -1 ? undefined : pair.slice(c + 1).trim();
			if (!rawName || rawName.startsWith('...')) continue;
			typeMap.set(rawName.replace('?', '').trim(), {
				optional,
				type: cleanType(type),
				description: extractJsdoc(pair),
			});
		}
	}

	const SKIP = new Set(['restProps', 'children', 'ref']);
	const out = [];
	for (const member of exp.members) {
		const propDesc = extractJsdoc(member);
		const cleaned = member.replace(/\/\*\*[\s\S]*?\*\//, '').trim();
		const eq = cleaned.indexOf('=');
		let lhs = (eq === -1 ? cleaned : cleaned.slice(0, eq)).trim();
		let rhs = eq === -1 ? undefined : cleaned.slice(eq + 1).trim();
		let name = lhs;
		if (lhs.includes(':')) name = lhs.slice(0, lhs.indexOf(':')).trim(); // alias
		if (!name || name.startsWith('...') || SKIP.has(name)) continue;

		let def = literalDefault(rhs);
		let type = typeMap.get(name)?.type;
		let values;
		let description = propDesc ?? typeMap.get(name)?.description;

		// Variant props via tv() — matched by destructured name (variant/size).
		if (variants.has(name)) {
			const v = variants.get(name);
			type = 'string';
			values = v.values;
			if (def === undefined && v.def !== undefined) def = v.def;
		}

		// Literal-union type → enum values + simple type.
		if (type && type.includes('"')) {
			const quoted = [...type.matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
			if (quoted.length) {
				values = values?.length ? values : quoted;
				type = def === true || def === false ? 'boolean' : 'string';
			}
		}

		out.push({
			name,
			type: type ?? 'any',
			default: def,
			values,
			description: description || undefined,
		});
	}
	return out;
}

// ---------------------------------------------------------------------------
// v1-style dependency scanning (unchanged behavior).
// ---------------------------------------------------------------------------

function collectScripts(code) {
	const out = [];
	let m;
	while ((m = SVELTE_RE.exec(code)) !== null) out.push(m[0]);
	return out;
}

function walkFiles(dir) {
	const results = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) results.push(...walkFiles(full));
		else if (/\.(svelte|ts)$/.test(entry.name)) results.push(full);
	}
	return results;
}

function isComponentFile(file) {
	const name = basename(file);
	if (!/\.svelte$/.test(name)) return false;
	const ext = name.slice(0, -7);
	if (ext === 'svelte' || ext === 'index') return false;
	return true;
}

function depsOf(file) {
	const code = readFileSync(file, 'utf8');
	const deps = new Set();
	const scripts = /\.svelte$/.test(file) ? collectScripts(code) : [code];
	for (const script of scripts) {
		let m;
		while ((m = IMPORT_RE.exec(script)) !== null) {
			const spec = m[1];
			if (IGNORE_SET.has(spec)) continue;
			if (spec.startsWith('$lib/')) {
				const rel = spec.slice('$lib/'.length);
				if (rel.startsWith('components/')) {
					const seg = rel.split('/');
					const last = seg.at(-1);
					const isIndexFile = last === 'index.js' || last === 'index.ts';
					if (isIndexFile && seg.length >= 3) {
						const name = seg.at(-2);
						if (name !== 'index' && name) deps.add(name);
					} else if (seg.length === 2 && !isIndexFile) {
						const name = seg[0];
						if (name !== 'index' && name) deps.add(name);
					}
				} else if (rel === 'utils.js' || rel === 'utils.ts' || rel === 'utils') {
					deps.add('utils');
				} else if (rel === 'i18n/index.js' || rel === 'i18n/index.ts') {
					deps.add('i18n');
				}
				continue;
			}
			if (KNOWN_RE.test(spec)) continue;
			if (spec.startsWith('./') || spec.startsWith('../')) continue;
		}
	}
	return [...deps];
}

// ---------------------------------------------------------------------------
// Main generation.
// ---------------------------------------------------------------------------

const components = [];
for (const { package: pkg, dir: pkgDir } of PKG_DIRS) {
	if (!existsSync(pkgDir)) {
		console.warn(`Registry: components dir not found: ${pkgDir}`);
		continue;
	}
	for (const dir of readdirSync(pkgDir, { withFileTypes: true })) {
		if (!dir.isDirectory()) continue;
		const name = dir.name;
		const abs = join(pkgDir, name);
		const files = walkFiles(abs);
		if (files.length === 0) continue;
		const main = files.find(
			(f) => basename(f) === 'index.svelte' || basename(f) === `${name}.svelte`,
		);
		const mainTs = files.find((f) => basename(f) === 'index.ts');
		const fileList = files.map((f) => relative(pkgDir, f).split(sep).join('/'));
		const contents = {};
		for (const f of files) {
			contents[relative(pkgDir, f).split(sep).join('/')] = readFileSync(f, 'utf8');
		}
		// Runtime deps come from the component's source package.json, embedded
		// so the CLI resolves them from npm without the monorepo.
		const pkgJson = JSON.parse(
			readFileSync(join(repoRoot, 'packages', pkg, 'package.json'), 'utf8'),
		);
		const packageDeps = pkgJson.dependencies ?? {};
		const deps = new Set();
		for (const f of files) for (const d of depsOf(f)) deps.add(d);
		deps.delete(name);

		// Rich metadata from the main component file (best-effort).
		let description = null;
		let props = [];
		const propsSource = main ?? files.find((f) => isComponentFile(f)) ?? files.at(-1);
		if (propsSource) {
			const code = contents[relative(pkgDir, propsSource).split(sep).join('/')];
			if (code) {
				const scripts = collectScripts(code);
				for (const script of scripts) {
					description = findDescription(script);
					if (description) break;
				}
				props = extractProps(code, parseTvDefinitions(scripts));
			}
		}
		if (!description) description = simpleDescription(name);
		components.push({
			name,
			description,
			category: categoryOf(name),
			tags: tagsOf(name, categoryOf(name)),
			files: fileList,
			contents,
			packageDeps,
			deps: [...deps].sort(),
			main: main ? relative(pkgDir, main).split(sep).join('/') : undefined,
			mainTs: mainTs ? relative(pkgDir, mainTs).split(sep).join('/') : undefined,
			isComponent: isComponentFile(main ?? files[0]),
			entry: fileList.find((f) => f === `${name}/index.ts`),
			props,
			package: pkg,
		});
	}
}


components.sort((a, b) => a.name.localeCompare(b.name));
const payload = {
	schema: 'v3',
	generatedAt: new Date().toISOString(),
	components,
};
writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
console.log(`Registry v3: ${components.length} components -> ${outPath}`);
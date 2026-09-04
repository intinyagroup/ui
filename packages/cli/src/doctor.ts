import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot } from './init.js';

export interface DoctorCheck {
	key: string;
	label: string;
	ok: boolean;
	detail: string;
}

/**
 * Inspect the consumer project and report setup health:
 * components.json, cn() utils, @intinyagroup/tokens dependency, token CSS import.
 */
export function runDoctor(cwd: string): { checks: DoctorCheck[]; root: string } {
	const root = projectRoot(cwd);
	const checks: DoctorCheck[] = [];

	// 1. components.json
	const componentsPath = join(root, 'components.json');
	const hasComponents = existsSync(componentsPath);
	let cssConfigured: string | undefined;
	if (hasComponents) {
		try {
			const raw = JSON.parse(readFileSync(componentsPath, 'utf8')) as {
				tailwind?: { css?: string };
			};
			cssConfigured = raw.tailwind?.css;
		} catch {
			cssConfigured = undefined;
		}
	}
	checks.push({
		key: 'components',
		label: 'components.json exists',
		ok: hasComponents,
		detail: hasComponents
			? componentsPath
			: 'missing — run `npx @intinyagroup/cli init`',
	});

	// 2. cn() utils
	const utilsPath = join(root, 'src', 'lib', 'utils.ts');
	let hasCn = false;
	let utilsDetail = `${utilsPath} — missing, run \`npx @intinyagroup/cli init\``;
	if (existsSync(utilsPath)) {
		const src = readFileSync(utilsPath, 'utf8');
		hasCn = /\bexport\s+function\s+cn\s*\(/.test(src) || /\bconst\s+cn\s*:/.test(src);
		utilsDetail = `${utilsPath}${hasCn ? '' : ' — file exists but cn() not found'}`;
	}
	checks.push({
		key: 'utils',
		label: 'utils.ts with cn()',
		ok: hasCn,
		detail: utilsDetail,
	});

	// 3. @intinyagroup/tokens dependency
	const pkgPath = join(root, 'package.json');
	let hasTokens = false;
	let pkgDetail = `${pkgPath} — missing, run \`npx @intinyagroup/cli init\``;
	if (existsSync(pkgPath)) {
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
			dependencies?: Record<string, string>;
			devDependencies?: Record<string, string>;
		};
		hasTokens =
			pkg.dependencies?.['@intinyagroup/tokens'] !== undefined ||
			pkg.devDependencies?.['@intinyagroup/tokens'] !== undefined;
		pkgDetail = hasTokens
			? '@intinyagroup/tokens'
			: '@intinyagroup/tokens missing from package.json — run `npx @intinyagroup/cli init`';
	}
	checks.push({
		key: 'tokens',
		label: '@intinyagroup/tokens installed',
		ok: hasTokens,
		detail: pkgDetail,
	});

	// 4. token import in CSS
	let hasCssImport = false;
	let cssDetail = 'no CSS entry found';
	if (cssConfigured) {
		const cssPath = cssConfigured.startsWith('src/')
			? join(root, 'src', cssConfigured.slice(4))
			: join(root, cssConfigured);
		if (existsSync(cssPath)) {
			hasCssImport = readFileSync(cssPath, 'utf8').includes('@intinyagroup/tokens');
			cssDetail = hasCssImport
				? `${cssPath} imports @intinyagroup/tokens`
				: `${cssPath} — add \`@import "@intinyagroup/tokens";\``;
		} else {
			cssDetail = `${cssPath} — configured but file missing`;
		}
	} else {
		const candidates = ['src/app.css', 'src/styles.css', 'src/app.pcss', 'src/styles.pcss'];
		const cssPath = candidates.map((c) => join(root, c)).find((p) => existsSync(p));
		if (cssPath) {
			hasCssImport = readFileSync(cssPath, 'utf8').includes('@intinyagroup/tokens');
			cssDetail = hasCssImport
				? `${cssPath} imports @intinyagroup/tokens`
				: `${cssPath} — add \`@import "@intinyagroup/tokens";\``;
		}
	}
	checks.push({
		key: 'css',
		label: 'CSS imports tokens',
		ok: hasCssImport,
		detail: cssDetail,
	});

	return { checks, root };
}


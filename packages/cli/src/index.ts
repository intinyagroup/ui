#!/usr/bin/env node
import { program } from 'commander';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadRegistry, type RegistryComponent } from './registry.js';
import { installComponents, syncDependencies } from './install.js';
import { initProject } from './init.js';
import { updateComponents } from './update.js';
import { runDoctor } from './doctor.js';

function toPascal(name: string): string {
	return name
		.split('-')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join('');
}

function readPkgVersion(): string | null {
	try {
		const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
		return pkg.dependencies?.['@intinyagroup/ui'] ?? null;
	} catch {
		return null;
	}
}
program
	.name('intinya')
	.description('Intinya UI component installer for Svelte and React projects')
	.version('0.1.0');

program
	.command('init')
	.description('Initialize Intinya UI in your project')
	.option('-f, --framework <framework>', 'framework: svelte (default) or react')
	.action(async (opts: { framework?: 'svelte' | 'react' }) => {
		try {
			const result = initProject(process.cwd());
			console.log(`Detected project type: ${result.projectType}`);
			switch (result.componentsJson) {
				case 'created':
					console.log('Created components.json');
					break;
				case 'updated':
					console.log('Updated components.json');
					break;
				case 'error':
					console.error('Warning: could not write components.json');
					break;
			}
			if (result.depsAdded.length > 0) {
				console.log(
					`Added ${result.depsAdded.length} dependency(ies) to package.json: ${result.depsAdded.join(', ')}`,
				);
				console.log('Run `pnpm install` (or `npm install`) to install them.');
			} else {
				console.log('Dependencies already present in package.json');
			}
			if (result.cssTouched) {
				console.log(`Added token import to ${result.cssPath}`);
			} else if (result.cssPath) {
				console.log(`Token import already present in ${result.cssPath}`);
			} else {
				console.log('Could not find a CSS entry file to add the token import.');
			}
			if (result.utilsCreated) {
				console.log(`Created cn() utils at ${result.utilsPath}`);
			}
			console.log('\nIntinya UI is ready. Next steps:');
			console.log('  1. Install dependencies: pnpm install');
			console.log('  2. Add a component: npx @intinyagroup/cli add button');
			console.log('  3. Check setup: npx @intinyagroup/cli doctor');
		} catch (err) {
			console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
			process.exit(1);
		}
	});

program
	.command('add')
	.description('Add a Intinya UI component to your project')
	.argument('<components...>', 'component names, e.g. button card data-table')
	.option('-y, --yes', 'skip confirmation and overwrite existing files')
	.option('-o, --overwrite', 'overwrite existing component files')
	.option('-m, --mode <mode>', 'install mode: copy (default) or npm (add to package.json)', 'copy')
	.option('-f, --framework <framework>', 'target framework: svelte or react')
	.action(
		async (
			components: string[],
			opts: { yes?: boolean; overwrite?: boolean; mode?: string; framework?: 'svelte' | 'react' },
		) => {
			const overwrite = opts.yes || opts.overwrite || false;
			const mode = opts.mode ?? 'copy';
			try {
				const registry = await loadRegistry();
				const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
				const known = new Set(registry.components.map((c) => norm(c.name)));
				const unknown = components.filter((c) => !known.has(norm(c)));
				if (unknown.length > 0) {
					console.error(
						`Unknown component${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}`,
					);
					console.error(`Available: ${registry.components.map((c) => c.name).sort().join(', ')}`);
					process.exit(1);
				}

				if (mode === 'npm') {
					const { added, hasPackageJson } = syncDependencies(
						process.cwd(),
						registry,
						components,
					);
					if (!hasPackageJson) {
						console.error('No package.json found — cannot add npm dependencies.');
						process.exit(1);
					}
					const depNames = Object.keys(added);
					const uiVer =
						readPkgVersion() ?? '^0.1.0-alpha.7';
					if (!depNames.includes('@intinyagroup/ui')) {
						depNames.unshift('@intinyagroup/ui');
						added['@intinyagroup/ui'] = uiVer;
					}
					console.log(
						`Added ${depNames.length} dependency(ies) to package.json (npm mode):`,
					);
					for (const d of depNames) console.log(`  ${d}@${added[d]}`);
					console.log('Run `npm install` (or `pnpm install`) to install them.');
					console.log('');
					console.log('Import usage:');
					for (const c of components) {
						console.log(`  import { ${toPascal(c)} } from '@intinyagroup/ui';`);
					}
					return;
				}

				const { installed, written, skipped, addedDeps } = await installComponents(
					components,
					{ overwrite, cwd: process.cwd() },
				);

				console.log(`Installed ${installed.length} component(s): ${installed.join(', ')}`);
				if (written.length > 0) {
					console.log(`Wrote ${written.length} file(s)`);
				}
				if (skipped.length > 0) {
					console.log(
						`Skipped ${skipped.length} existing file(s) (use --overwrite to replace):`,
					);
					for (const f of skipped) console.log(`  ${f}`);
				}
				const depNames = Object.keys(addedDeps);
				if (depNames.length > 0) {
					console.log(`Added ${depNames.length} dependency(ies) to package.json:`);
					for (const d of depNames) console.log(`  ${d}@${addedDeps[d]}`);
					console.log('Run `pnpm install` to install them.');
				}
			} catch (err) {
				console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
				process.exit(1);
			}
		},
	);

program
	.command('update')
	.description('Update installed Intinya UI components to the latest version')
	.argument('[components...]', 'component names to update, e.g. button card')
	.option('-a, --all', 'update every installed component')
	.action(
		async (
			components: string[],
			opts: { all?: boolean },
		) => {
			if (components.length === 0 && !opts.all) {
				console.error('Specify components to update, or use --all to update everything.');
				process.exit(1);
			}
			try {
				const result = await updateComponents(components, {
					all: opts.all ?? false,
					cwd: process.cwd(),
				});

				if (result.missing.length > 0) {
					console.log(
						`Component(s) not installed, skipping: ${result.missing.join(', ')}`,
					);
					console.log('  Tip: use `npx @intinyagroup/cli add <name>` to install them.');
				}
				if (result.updated.length > 0) {
					console.log(`Updated ${result.updated.length} file(s):`);
					for (const f of result.updated) console.log(`  ${f}`);
				}
				if (result.added.length > 0) {
					console.log(`Added ${result.added.length} missing file(s):`);
					for (const f of result.added) console.log(`  ${f}`);
				}
				if (result.upToDate.length > 0) {
					console.log(
						`${result.upToDate.length} file(s) already up to date (skipped).`,
					);
				}
				const depNames = Object.keys(result.addedDeps);
				if (depNames.length > 0) {
					console.log(`Added ${depNames.length} dependency(ies) to package.json:`);
					for (const d of depNames) console.log(`  ${d}@${result.addedDeps[d]}`);
					console.log('Run `pnpm install` to install them.');
				}
			} catch (err) {
				console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
				process.exit(1);
			}
		},
	);

program
	.command('doctor')
	.description('Check that Intinya UI is set up correctly in your project')
	.action(async () => {
		try {
			const { checks, root } = runDoctor(process.cwd());
			console.log(`Checking Intinya UI setup in ${root}`);
			let okCount = 0;
			for (const check of checks) {
				console.log(`${check.ok ? '✅' : '❌'} ${check.label}${check.ok ? '' : ' — ' + check.detail}`);
				if (check.ok) okCount++;
			}
			console.log(
				`\n${okCount}/${checks.length} check(s) passed.` +
					(okCount === checks.length
						? ' Intinya UI is set up correctly.'
						: ' Run `npx @intinyagroup/cli init` to fix the failing checks.'),
			);
		} catch (err) {
			console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
			process.exit(1);
		}
	});

program
	.command('list')
	.description('List all available components')
	.option('-v, --verbose', 'show component descriptions')
	.action(async (opts: { verbose?: boolean }) => {
		try {
			const registry = await loadRegistry();
			const { components } = registry;
			const verbose = Boolean(opts.verbose);

			if (components.length === 0) {
				console.log('No components available.');
				return;
			}

			const groups = new Map<string, RegistryComponent[]>();
			for (const comp of components) {
				const cat = comp.category ?? 'uncategorized';
				if (!groups.has(cat)) groups.set(cat, []);
				groups.get(cat)!.push(comp);
			}

			console.log(`${components.length} components available (registry ${registry.schema}):`);
			for (const [category, list] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
				console.log(`\n${category}`);
				for (const comp of [...list].sort((a, b) => a.name.localeCompare(b.name))) {
					if (verbose && comp.description) {
						console.log(`  ${comp.name.padEnd(28)} ${comp.description}`);
					} else {
						console.log(`  ${comp.name}`);
					}
				}
			}
		} catch (err) {
			console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
			process.exit(1);
		}
	});

program.parse();

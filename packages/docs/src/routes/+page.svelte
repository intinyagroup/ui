<script lang="ts">
	import { ArrowRight, Blocks, Moon, Palette, Sparkles, Zap } from 'lucide-svelte';

	const features = [
		{
			icon: Blocks,
			title: '100+ components',
			desc: 'Buttons to data tables — every base component you need.'
		},
		{
			icon: Zap,
			title: 'CLI installer',
			desc: 'Copy components straight into your project with npx @intinyagroup/cli add.'
		},
		{
			icon: Palette,
			title: 'Design tokens',
			desc: 'Theme everything with CSS custom properties. Nine themes included.'
		},
		{
			icon: Moon,
			title: 'Dark mode',
			desc: 'First-class dark mode via the same token system.'
		}
	];

	const themes = [
		{ name: 'shadcn', label: 'Shadcn', desc: 'Clean & muted', color: 'oklch(0.7 0.15 265)' },
		{ name: 'md3', label: 'MD3', desc: 'Material Design 3', color: 'oklch(0.6 0.18 265)' },
		{ name: 'flat', label: 'Flat', desc: 'Bold & geometric', color: '#3b82f6' },
		{ name: 'glass', label: 'Glass', desc: 'Translucent blur', color: 'oklch(0.7 0.12 200)' },
		{ name: 'brutalist', label: 'Brutalist', desc: 'Raw & heavy', color: 'oklch(0.15 0 0)' },
		{ name: 'neumorphism', label: 'Neumorphism', desc: 'Soft & tactile', color: 'oklch(0.6 0.12 260)' },
		{ name: 'retro', label: 'Retro', desc: 'Warm & nostalgic', color: 'oklch(0.6 0.15 25)' },
		{ name: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon & electric', color: 'oklch(0.55 0.2 180)' },
		{ name: 'minimalist', label: 'Minimalist', desc: 'Mono & airy', color: 'oklch(0.1 0 0)' }
	];

	let activeTheme = $state('shadcn');

	const components = ['Button', 'Card', 'Badge', 'Dialog', 'Input', 'Tabs', 'Accordion', 'Toast', 'Table', 'Select'];
</script>

<svelte:head>
	<title>Intinya UI — Svelte 5 component library</title>
	<meta name="description" content="Intinya UI is a Svelte 5 component library with design tokens, CLI installer, and 100+ components." />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 pt-20 pb-16 text-center">
	<span class="inline-flex items-center gap-2 rounded-full border border-[var(--ui-border)] bg-[var(--ui-card)] px-3 py-1 text-xs font-medium text-[var(--ui-muted-foreground)]">
		<Sparkles class="size-3.5" />
		Svelte 5 + Tailwind v4
	</span>
	<h1 class="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
		Build faster with <span class="text-[var(--ui-primary)]">Intinya UI</span>
	</h1>
	<p class="mx-auto mt-4 max-w-xl text-lg text-[var(--ui-muted-foreground)]">
		A Svelte 5 component library with design tokens, CLI installer, and a growing catalog of production components.
	</p>
	<div class="mt-8 flex items-center justify-center gap-3">
		<a
			href="/docs/getting-started"
			class="inline-flex items-center gap-2 rounded-lg bg-[var(--ui-primary)] px-5 py-2.5 text-sm font-medium text-[var(--ui-primary-foreground)] transition-opacity hover:opacity-90"
		>
			Get started
			<ArrowRight class="size-4" />
		</a>
		<a
			href="/docs/components"
			class="inline-flex items-center gap-2 rounded-lg border border-[var(--ui-border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--ui-muted)]"
		>
			Browse components
		</a>
		<a
			href="https://ui.intinya.id"
			target="_blank"
			rel="noreferrer"
			class="inline-flex items-center gap-2 rounded-lg border border-[var(--ui-border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--ui-muted)]"
		>
			Live docs
		</a>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 pb-16">
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each features as feature}
			<div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-5">
				<div class="mb-3 flex size-9 items-center justify-center rounded-lg bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]">
					<feature.icon class="size-5" />
				</div>
				<h3 class="font-semibold">{feature.title}</h3>
				<p class="mt-1 text-sm text-[var(--ui-muted-foreground)]">{feature.desc}</p>
			</div>
		{/each}
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 pb-20">
	<div class="mb-8 text-center">
		<h2 class="text-3xl font-bold">Choose your style</h2>
		<p class="mt-2 text-[var(--ui-muted-foreground)]">One import swap. Entire app personality changes.</p>
	</div>
	<div class="flex flex-wrap items-center justify-center gap-3 mb-8">
		{#each themes as theme}
			<button
				onclick={() => {
					activeTheme = theme.name;
					document.documentElement.dataset.uiTheme = theme.name === 'shadcn' ? 'neutral' : theme.name;
				}}
				class="flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all {activeTheme === theme.name
					? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/5'
					: 'border-[var(--ui-border)] hover:border-[var(--ui-muted-foreground)]'}"
			>
				<div class="size-6 rounded-full" style="background-color: {theme.color}"></div>
				<div class="text-left">
					<div class="text-sm font-semibold">{theme.label}</div>
					<div class="text-xs text-[var(--ui-muted-foreground)]">{theme.desc}</div>
				</div>
			</button>
		{/each}
	</div>
	<div class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-8 shadow-lg">
		<div class="grid gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-muted)] p-6">
				<div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]">
					<Palette class="size-5" />
				</div>
				<h3 class="font-semibold">Token-driven</h3>
				<p class="mt-1 text-sm text-[var(--ui-muted-foreground)]">Same components, different feel</p>
			</div>
			<div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-muted)] p-6">
				<div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]">
					<Blocks class="size-5" />
				</div>
				<h3 class="font-semibold">9 themes included</h3>
				<p class="mt-1 text-sm text-[var(--ui-muted-foreground)]">Shadcn, MD3, Flat, Glass, Brutalist, Neumorphism, Retro, Cyberpunk, Minimalist</p>
			</div>
			<div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-muted)] p-6">
				<div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]">
					<Zap class="size-5" />
				</div>
				<h3 class="font-semibold">Zero JS overhead</h3>
				<p class="mt-1 text-sm text-[var(--ui-muted-foreground)]">Pure CSS tokens, no runtime</p>
			</div>
		</div>
		<div class="mt-6 text-center">
			<a
				href="/docs/themes"
				class="inline-flex items-center gap-2 rounded-lg bg-[var(--ui-primary)] px-5 py-2.5 text-sm font-medium text-[var(--ui-primary-foreground)] transition-opacity hover:opacity-90"
			>
				Explore themes
				<ArrowRight class="size-4" />
			</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 pb-20">
	<h2 class="mb-4 text-2xl font-semibold">Popular components</h2>
	<div class="flex flex-wrap gap-2">
		{#each components as name}
			<a
				href="/docs/components/{name.toLowerCase()}"
				class="rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--ui-muted)]"
			>
				{name}
			</a>
		{/each}
	</div>
</section>

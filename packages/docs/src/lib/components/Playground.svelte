<script lang="ts">
	import { Code2, Eye, RotateCcw, SlidersHorizontal } from 'lucide-svelte';
	import PropsPanel from './PropsPanel.svelte';
	import CodeBlock from './CodeBlock.svelte';
	import type { Snippet } from 'svelte';

	export type PlaygroundProp = {
		name: string;
		label?: string;
		type: 'string' | 'number' | 'boolean' | 'enum' | 'color';
		default?: any;
		values?: string[]; // for enum
		min?: number; // for number
		max?: number; // for number
		step?: number; // for number
		description?: string;
	};

	let {
		title = 'Playground',
		description,
		props = [] as PlaygroundProp[],
		render,
		getCode,
		className = ''
	}: {
		title?: string;
		description?: string;
		props?: PlaygroundProp[];
		render: Snippet<[Record<string, any>]>;
		getCode: (values: Record<string, any>) => string;
		className?: string;
	} = $props();

	function defaults(): Record<string, any> {
		const init: Record<string, any> = {};
		for (const p of props) {
			if (p.default !== undefined) {
				init[p.name] = p.default;
			} else if (p.type === 'number') {
				init[p.name] = p.min ?? 0;
			} else if (p.type === 'boolean') {
				init[p.name] = false;
			} else if (p.type === 'enum') {
				init[p.name] = p.values?.[0] ?? '';
			} else {
				init[p.name] = '';
			}
		}
		return init;
	}

	let values = $state<Record<string, any>>(defaults());

	let tab = $state<'preview' | 'code'>('preview');
	let showProps = $state(true);

	function reset() {
		values = defaults();
	}
</script>

<div class="my-6 overflow-hidden rounded-lg border border-[var(--ui-border)] {className}">
	<!-- Header -->
	<div class="flex items-center justify-between gap-3 border-b border-[var(--ui-border)] px-4 py-2">
		<div class="min-w-0">
			<span class="text-sm font-medium">{title}</span>
			{#if description}
				<p class="truncate text-xs text-[var(--ui-muted-foreground)]">{description}</p>
			{/if}
		</div>
		<div class="flex shrink-0 items-center gap-1">
			<button
				onclick={reset}
				title="Reset values"
				class="rounded-md p-1.5 text-[var(--ui-muted-foreground)] transition-colors hover:bg-[var(--ui-muted)] hover:text-[var(--ui-foreground)]"
			>
				<RotateCcw class="size-3.5" />
			</button>
			<button
				onclick={() => (tab = 'preview')}
				class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors {tab === 'preview'
					? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]'
					: 'hover:bg-[var(--ui-muted)]'}"
			>
				<Eye class="size-3.5" />
				Preview
			</button>
			<button
				onclick={() => (tab = 'code')}
				class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors {tab === 'code'
					? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]'
					: 'hover:bg-[var(--ui-muted)]'}"
			>
				<Code2 class="size-3.5" />
				Code
			</button>
			{#if props.length > 0}
				<button
					onclick={() => (showProps = !showProps)}
					title={showProps ? 'Hide props' : 'Show props'}
					class="rounded-md p-1.5 text-[var(--ui-muted-foreground)] transition-colors hover:bg-[var(--ui-muted)] hover:text-[var(--ui-foreground)] {showProps
						? 'bg-[var(--ui-muted)] text-[var(--ui-foreground)]'
						: ''}"
				>
					<SlidersHorizontal class="size-3.5" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Body -->
	<div class="flex flex-col md:flex-row">
		<div class="flex min-h-32 flex-1 items-center justify-center overflow-x-auto p-8">
			{#if tab === 'preview'}
				{@render render(values)}
			{:else}
				<CodeBlock code={getCode(values)} />
			{/if}
		</div>
		{#if showProps && props.length > 0}
			<aside
				class="w-full shrink-0 border-t border-[var(--ui-border)] p-4 md:w-60 md:border-t-0 md:border-l"
			>
				<PropsPanel
					schema={props}
					values={values}
					onchange={(name, value) => {
						values[name] = value;
					}}
				/>
			</aside>
		{/if}
	</div>
</div>
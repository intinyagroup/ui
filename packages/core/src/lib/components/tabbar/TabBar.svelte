<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const tabBarVariants = tv({
		base: 'fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-[var(--ui-border)] bg-[var(--ui-background)]',
		variants: {
			blur: {
				true: 'supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--ui-background)_88%,transparent)] supports-[backdrop-filter]:backdrop-blur-xl',
				false: ''
			}
		},
		defaultVariants: { blur: true }
	});
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';
	import { TAB_BAR_KEY } from './context.js';

	let {
		value = $bindable(''),
		blur = true,
		class: className,
		children
	}: {
		value?: string | number;
		blur?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	// Reactive state object — passed via context so children's $derived
	// subscriptions track it (a plain closure over `value` is not reactive).
	const valueState = $state({ value });

	$effect(() => {
		valueState.value = value;
	});

	setContext(TAB_BAR_KEY, {
		get value() {
			return valueState.value;
		},
		setValue(v: string | number) {
			value = v;
			valueState.value = v;
		}
	});
</script>

<nav
	class={cn(tabBarVariants({ blur }), 'pb-[env(safe-area-inset-bottom)]', className)}
	aria-label="Primary navigation"
>
	<div class="flex h-14 w-full items-stretch" role="tablist" aria-label="Primary">
		{@render children()}
	</div>
</nav>
<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		value = $bindable(),
		class: className,
		children
	}: {
		value: string;
		class?: string;
		children?: Snippet;
	} = $props();

	function handleSelect(selectedValue: string) {
		value = selectedValue;
	}

	setContext('navigation-bar', {
		get value() {
			return value;
		},
		onSelect: handleSelect
	});
</script>

<nav
	class={cn(
		'fixed bottom-0 left-0 right-0 z-50',
		'flex items-stretch',
		'bg-[var(--ui-surface-container)]',
		'shadow-[var(--ui-shadow-md)]',
		'h-20 px-0',
		className
	)}
	role="navigation"
>
	{@render children?.()}
</nav>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type NavigationBarContext = {
		value: string;
		onSelect: (value: string) => void;
	};

	let {
		value,
		icon,
		label,
		class: className
	}: {
		value: string;
		icon: Snippet;
		label: string;
		class?: string;
	} = $props();

	const ctx = getContext<NavigationBarContext>('navigation-bar');
	const active = $derived(ctx.value === value);
	let isPressed = $state(false);

	function handleClick() {
		ctx.onSelect(value);
	}
</script>

<button
	class={cn(
		'relative flex flex-1 flex-col items-center justify-center gap-1 py-1',
		'cursor-pointer select-none outline-none',
		'transition-colors duration-200',
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-ring)]',
		className
	)}
	aria-label={label}
	aria-current={active ? 'page' : undefined}
	onclick={handleClick}
	onpointerdown={() => (isPressed = true)}
	onpointerup={() => (isPressed = false)}
	onpointerleave={() => (isPressed = false)}
>
	<!-- Active indicator pill -->
	<span
		class={cn(
			'absolute top-0 flex h-8 w-16 items-center justify-center rounded-full',
			'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
			active
				? 'scale-100 bg-[var(--ui-primary-container)] opacity-100'
				: 'scale-50 bg-transparent opacity-0'
		)}
		aria-hidden="true"
	></span>

	<!-- State layer -->
	<span
		class={cn(
			'absolute top-0 flex h-16 w-16 items-center justify-center rounded-full',
			'bg-current transition-opacity duration-200',
			isPressed ? 'opacity-[0.12]' : 'opacity-0 hover:opacity-[0.08]'
		)}
		aria-hidden="true"
	></span>

	<!-- Icon -->
	<span
		class={cn(
			'relative z-10 flex h-6 w-6 items-center justify-center',
			'[&_svg]:h-6 [&_svg]:w-6',
			'transition-colors duration-200',
			active
				? 'text-[var(--ui-on-primary-container)]'
				: 'text-[var(--ui-on-surface-variant)]'
		)}
	>
		{@render icon()}
	</span>

	<!-- Label -->
	<span
		class={cn(
			'relative z-10 text-xs font-medium leading-tight tracking-wide',
			'transition-all duration-200',
			active
				? 'text-[var(--ui-on-primary-container)]'
				: 'text-[var(--ui-on-surface-variant)]'
		)}
	>
		{label}
	</span>
</button>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';

	let {
		label,
		destructive = false,
		icon,
		onselect,
		onclick,
		disabled = false,
		class: className
	}: {
		label: string;
		destructive?: boolean;
		icon?: Snippet;
		onselect?: () => void;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		class?: string;
	} = $props();

	function handleClick(e: MouseEvent) {
		onclick?.(e);
		onselect?.();
	}
</script>

<button
	type="button"
	{disabled}
	onclick={handleClick}
	class={cn(
		'flex min-h-12 w-full cursor-pointer touch-manipulation select-none items-center gap-3 px-4 py-2.5 text-left text-base',
		'transition-[background-color,opacity,transform] duration-[var(--ui-transition-fast)] active:scale-[0.99]',
		destructive ? 'text-[var(--ui-destructive)]' : 'text-[var(--ui-foreground)]',
		disabled && 'cursor-not-allowed opacity-50',
		className
	)}
>
	{#if icon}
		<span
			class="flex shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5"
			aria-hidden="true"
		>
			{@render icon()}
		</span>
	{/if}
	<span class="truncate">{label}</span>
</button>

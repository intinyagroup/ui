<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		title,
		value,
		color = 'yellow',
		size = 'md'
	}: {
		ref?: HTMLElement | null;
		class?: string;
		title: string;
		value?: string;
		color?: 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'orange';
		size?: 'md' | 'lg';
	} = $props();

	const sizeClasses = {
		md: 'w-32 h-32',
		lg: 'w-48 h-48'
	};

	const colorVar = $derived(`var(--flat-${color})`);
</script>

<div
	bind:this={ref}
	class={cn('flex flex-col items-center justify-center text-white', sizeClasses[size], className)}
	style:clip-path="var(--clip-star)"
	style:background-color={colorVar}
>
	<span class="font-bold text-center leading-tight">{title}</span>
	{#if value}
		<span class="text-sm opacity-90">{value}</span>
	{/if}
</div>

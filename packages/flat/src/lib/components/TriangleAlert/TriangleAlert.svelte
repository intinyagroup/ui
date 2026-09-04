<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		message,
		color = 'red',
		dismissable = false,
		ondismiss,
		class: className
	}: {
		message: string;
		color?: 'red' | 'yellow' | 'orange';
		dismissable?: boolean;
		ondismiss?: () => void;
		class?: string;
	} = $props();

	const textColor = $derived(color === 'yellow' ? 'text-black' : 'text-white');

</script>

<div
	style:clip-path="polygon(50% 0%, 0% 100%, 100% 100%)"
	style:background-color="var(--flat-{color})"
	class={cn(
		'relative flex items-center justify-center text-center',
		'pt-8 pb-4 px-4',
		textColor,
		className
	)}
>
	{#if dismissable}
		<button
			type="button"
			class={cn(
				'absolute top-6 right-4 flex h-6 w-6 items-center justify-center rounded-full',
				'text-sm font-bold opacity-70 transition-opacity hover:opacity-100',
				color === 'yellow' ? 'text-black' : 'text-white'
			)}
			onclick={ondismiss}
			aria-label="Dismiss"
		>
			×
		</button>
	{/if}
	<span class="px-4">{message}</span>
</div>

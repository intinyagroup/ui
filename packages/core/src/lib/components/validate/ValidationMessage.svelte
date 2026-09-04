<script lang="ts">
	import { cn } from '../../utils.js';
	import { AlertCircle } from 'lucide-svelte';

	let {
		error,
		class: className
	}: {
		error?: string | null;
		class?: string;
	} = $props();
</script>

{#if error}
	<p class={cn('flex items-center gap-1.5 text-sm text-[var(--ui-destructive)]', className)} role="alert">
		<AlertCircle class="size-3.5 shrink-0" />
		{error}
	</p>
{/if}

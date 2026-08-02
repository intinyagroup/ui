<script lang="ts">
	import { cn } from '../../utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: className,
		...restProps
	}: {
		class?: string;
	} & HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p class={cn('text-sm text-[var(--ui-muted-foreground)]', className)} {...restProps}></p>

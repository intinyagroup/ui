<script lang="ts">
	import { ExternalLink } from 'lucide-svelte';

	let { component }: { component: string } = $props();
	const baseUrl = 'https://github.com/intinyagroup/ui/tree/main/packages/core/src/lib/components';
</script>

<a
	href="{baseUrl}/{component}"
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex items-center gap-1.5 text-sm text-[var(--ui-muted-foreground)] hover:text-[var(--ui-primary)] transition-colors"
>
	<ExternalLink class="size-3.5" />
	View source
</a>

<script lang="ts">
	import { Portal } from "@ark-ui/svelte/portal";
	import type { ComponentProps } from "svelte";

	let { children, ...restProps }: ComponentProps<typeof Portal> = $props();
</script>

<Portal {...restProps}>
	{@render children?.()}
</Portal>

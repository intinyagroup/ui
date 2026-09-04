<script lang="ts">
	import { Select as ArkSelect } from "@ark-ui/svelte/select";
	import type { ComponentProps } from "svelte";

	let { children, ...restProps }: ComponentProps<typeof ArkSelect.Root> = $props();
</script>

<ArkSelect.Root {...restProps}>
	{@render children?.()}
</ArkSelect.Root>

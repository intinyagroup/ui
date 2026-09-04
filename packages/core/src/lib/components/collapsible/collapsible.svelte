<script lang="ts">
	import { Collapsible as ArkCollapsible } from "@ark-ui/svelte/collapsible";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		open = $bindable(false),
		children,
		...restProps
	}: ComponentProps<typeof ArkCollapsible.Root> = $props();
</script>

<ArkCollapsible.Root
	bind:ref
	bind:open
	data-slot="collapsible"
	{...restProps}
>
	{@render children?.()}
</ArkCollapsible.Root>

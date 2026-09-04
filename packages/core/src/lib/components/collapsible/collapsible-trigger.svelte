<script lang="ts">
	import { Collapsible as ArkCollapsible } from "@ark-ui/svelte/collapsible";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkCollapsible.Trigger> = $props();
</script>

<ArkCollapsible.Trigger bind:ref data-slot="collapsible-trigger" {...restProps}>
	{@render children?.()}
</ArkCollapsible.Trigger>

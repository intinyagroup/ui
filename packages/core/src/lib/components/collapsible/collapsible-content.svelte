<script lang="ts">
	import { Collapsible as ArkCollapsible } from "@ark-ui/svelte/collapsible";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkCollapsible.Content> = $props();
</script>

<ArkCollapsible.Content bind:ref data-slot="collapsible-content" {...restProps}>
	{@render children?.()}
</ArkCollapsible.Content>

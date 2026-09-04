<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkMenu.Trigger> = $props();
</script>

<ArkMenu.Trigger bind:ref data-slot="dropdown-menu-trigger" {...restProps}>
	{@render children?.()}
</ArkMenu.Trigger>

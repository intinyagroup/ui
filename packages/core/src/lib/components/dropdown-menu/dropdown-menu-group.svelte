<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkMenu.ItemGroup> = $props();
</script>

<ArkMenu.ItemGroup bind:ref data-slot="dropdown-menu-group" {...restProps}>
	{@render children?.()}
</ArkMenu.ItemGroup>

<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		children,
		...restProps
	}: ComponentProps<typeof ArkMenu.RadioItemGroup> = $props();
</script>

<ArkMenu.RadioItemGroup
	bind:ref
	bind:value
	data-slot="dropdown-menu-radio-group"
	{...restProps}
>
	{@render children?.()}
</ArkMenu.RadioItemGroup>

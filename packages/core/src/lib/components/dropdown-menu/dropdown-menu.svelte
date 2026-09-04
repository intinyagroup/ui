<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import type { ComponentProps } from "svelte";

	let { children, ...restProps }: ComponentProps<typeof ArkMenu.Root> = $props();
</script>

<ArkMenu.Root {...restProps}>
	{@render children?.()}
</ArkMenu.Root>

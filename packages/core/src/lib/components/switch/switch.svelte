<script lang="ts">
	import { Switch as ArkSwitch } from "@ark-ui/svelte/switch";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		children,
		...restProps
	}: ComponentProps<typeof ArkSwitch.Root> = $props();
</script>

<ArkSwitch.Root
	bind:ref
	bind:checked
	data-slot="switch"
	class={cn(
		"peer inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	<ArkSwitch.Control class="inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-2 data-[state=checked]:bg-[var(--ui-primary)] data-[state=unchecked]:bg-[var(--ui-input)]">
		<ArkSwitch.Thumb class="pointer-events-none block size-4 rounded-full bg-[var(--ui-background)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
	</ArkSwitch.Control>
	<ArkSwitch.HiddenInput />
	{#if children}
		<ArkSwitch.Label class="text-sm font-medium text-[var(--ui-foreground)]">
			{@render children()}
		</ArkSwitch.Label>
	{/if}
</ArkSwitch.Root>

<script lang="ts">
	import { Popover as PopoverPrimitive } from "bits-ui";
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";

	export type ComboboxOption = {
		value: string;
		label: string;
		description?: string;
	};

	type Props = {
		class?: string;
		options: ComboboxOption[];
		value?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		disabled?: boolean;
		onChange?: (value: string) => void;
	};

	let {
		class: className,
		options = [],
		value = $bindable(""),
		placeholder = "Select...",
		searchPlaceholder = "Search...",
		disabled = false,
		onChange,
	}: Props = $props();

	let open = $state(false);
	let searchQuery = $state("");

	let selectedLabel = $derived(
		options.find((o) => o.value === value)?.label ?? ""
	);

	function handleValueChange(currentValue: string) {
		if (currentValue === value) {
			value = "";
			onChange?.("");
		} else {
			value = currentValue;
			onChange?.(currentValue);
		}
		open = false;
		searchQuery = "";
	}

	function handleOpenChange(nextOpen: boolean) {
		open = nextOpen;
		if (!nextOpen) {
			searchQuery = "";
		}
	}
</script>

<PopoverPrimitive.Root {open} onOpenChange={handleOpenChange}>
	<PopoverPrimitive.Trigger
		class={cn(
			"flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors",
			"placeholder:text-muted-foreground",
			"focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none",
			"disabled:cursor-not-allowed disabled:opacity-50",
			"dark:bg-input/30",
			"[&>span]:line-clamp-1",
			className
		)}
		disabled={disabled}
	>
		<span class={cn(selectedLabel ? "text-foreground" : "text-muted-foreground")}>
			{selectedLabel || placeholder}
		</span>
		<ChevronsUpDownIcon class="size-4 shrink-0 text-muted-foreground opacity-50" />
	</PopoverPrimitive.Trigger>

	<PopoverPrimitive.Content
		class={cn(
			"z-50 w-(--popover-anchor-width) p-0 origin-(--transform-origin)",
			"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
			"data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
			"data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
		)}
		sideOffset={4}
	>
		<CommandPrimitive.Root
			class="overflow-hidden rounded-lg bg-popover text-popover-foreground"
			onValueChange={handleValueChange}
			filter={(value, search) => {
				const option = options.find((o) => o.value === value);
				if (!option) return 0;
				const labelMatch = option.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
				const descMatch = option.description?.toLowerCase().includes(search.toLowerCase()) ? 0.5 : 0;
				return Math.max(labelMatch, descMatch);
			}}
		>
			<div class="flex items-center border-b px-3" data-slot="combobox-input-wrapper">
				<CommandPrimitive.Input
					placeholder={searchPlaceholder}
					class="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
					bind:value={searchQuery}
				/>
			</div>

			<CommandPrimitive.List class="max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto p-1">
				<CommandPrimitive.Empty class="py-6 text-center text-sm text-muted-foreground">
					No results found.
				</CommandPrimitive.Empty>

				<CommandPrimitive.Group>
					{#each options as option (option.value)}
						<CommandPrimitive.Item
							value={option.value}
							class={cn(
								"relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none select-none",
								"focus:bg-accent focus:text-accent-foreground",
								"data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
							)}
						>
							<span class="absolute left-2 flex size-3.5 items-center justify-center">
								{#if value === option.value}
									<CheckIcon class="size-4" />
								{/if}
							</span>
							<span class="flex flex-1 flex-col gap-0.5">
								<span class="leading-none">{option.label}</span>
								{#if option.description}
									<span class="text-xs leading-snug text-muted-foreground">{option.description}</span>
								{/if}
							</span>
						</CommandPrimitive.Item>
					{/each}
				</CommandPrimitive.Group>
			</CommandPrimitive.List>
		</CommandPrimitive.Root>
	</PopoverPrimitive.Content>
</PopoverPrimitive.Root>

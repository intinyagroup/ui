<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { tick } from "svelte";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import XIcon from "@lucide/svelte/icons/x";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";

	export type SearchSelectOption = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	type Props = {
		class?: string;
		options: SearchSelectOption[];
		value?: string | string[];
		multiple?: boolean;
		placeholder?: string;
		searchPlaceholder?: string;
		emptyMessage?: string;
		loading?: boolean;
		remote?: boolean;
		disabled?: boolean;
		onChange?: (value: string | string[]) => void;
		onSearch?: (query: string) => void;
		children?: import("svelte").Snippet<[option: SearchSelectOption]>;
	};

	let {
		class: className,
		options = [],
		value = $bindable([] as string | string[]),
		multiple = false,
		placeholder = "Select...",
		searchPlaceholder = "Search...",
		emptyMessage = "No results found.",
		loading = false,
		remote = false,
		disabled = false,
		onChange,
		onSearch,
		children,
	}: Props = $props();

	let open = $state(false);
	let query = $state("");
	let highlightedIndex = $state(-1);
	let searchInputRef = $state<HTMLInputElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);
	let listRef = $state<HTMLDivElement | null>(null);

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	// Filtered options for local mode
	let filteredOptions = $derived(() => {
		if (remote) return options;
		if (!query.trim()) return options;
		const lower = query.toLowerCase();
		return options.filter(
			(o) =>
				o.label.toLowerCase().includes(lower) ||
				o.value.toLowerCase().includes(lower)
		);
	});

	// Selected options lookup
	let selectedValues = $derived(() => {
		if (multiple) return new Set(value as string[]);
		return new Set(value ? [value as string] : []);
	});

	let selectedOptions = $derived(() => {
		if (multiple) return options.filter((o) => (value as string[]).includes(o.value));
		return options.filter((o) => o.value === value);
	});

	function isSelected(option: SearchSelectOption): boolean {
		return selectedValues().has(option.value);
	}

	function selectOption(option: SearchSelectOption) {
		if (option.disabled) return;

		if (multiple) {
			const current = value as string[];
			const next = isSelected(option)
				? current.filter((v) => v !== option.value)
				: [...current, option.value];
			value = next;
			onChange?.(next);
			// Keep open in multi mode, clear query
			query = "";
			highlightedIndex = -1;
			tick().then(() => searchInputRef?.focus());
		} else {
			value = option.value;
			onChange?.(option.value);
			open = false;
			query = "";
		}
	}

	function removeValue(val: string) {
		if (!multiple) {
			value = "";
			onChange?.("");
			return;
		}
		const next = (value as string[]).filter((v) => v !== val);
		value = next;
		onChange?.(next);
	}

	function handleQueryInput() {
		highlightedIndex = -1;

		if (remote && onSearch) {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				onSearch(query);
			}, 300);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		const opts = filteredOptions();

		switch (e.key) {
			case "ArrowDown": {
				e.preventDefault();
				if (!open) {
					open = true;
				}
				let next = highlightedIndex;
				do {
					next = (next + 1) % opts.length;
				} while (opts[next]?.disabled && next !== highlightedIndex);
				highlightedIndex = next;
				scrollToHighlighted();
				break;
			}
			case "ArrowUp": {
				e.preventDefault();
				let prev = highlightedIndex;
				do {
					prev = prev <= 0 ? opts.length - 1 : prev - 1;
				} while (opts[prev]?.disabled && prev !== highlightedIndex);
				highlightedIndex = prev;
				scrollToHighlighted();
				break;
			}
			case "Enter": {
				e.preventDefault();
				if (open && highlightedIndex >= 0 && opts[highlightedIndex]) {
					selectOption(opts[highlightedIndex]);
				} else if (!open) {
					open = true;
				}
				break;
			}
			case "Escape": {
				e.preventDefault();
				open = false;
				query = "";
				break;
			}
			case "Tab": {
				open = false;
				query = "";
				break;
			}
			case "Backspace": {
				if (multiple && !query && (value as string[]).length > 0) {
					const last = (value as string[])[(value as string[]).length - 1];
					removeValue(last);
				}
				break;
			}
		}
	}

	function scrollToHighlighted() {
		tick().then(() => {
			const list = listRef;
			if (!list) return;
			const el = list.querySelector(`[data-index="${highlightedIndex}"]`);
			if (el) {
				el.scrollIntoView({ block: "nearest" });
			}
		});
	}

	function toggleOpen() {
		if (disabled) return;
		open = !open;
		if (open) {
			tick().then(() => searchInputRef?.focus());
		} else {
			query = "";
		}
	}

	function handleClickOutside(e: MouseEvent) {
		if (containerRef && !containerRef.contains(e.target as Node)) {
			open = false;
			query = "";
		}
	}

	$effect(() => {
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	});

	// Reset highlighted when options change
	$effect(() => {
		const _opts = filteredOptions();
		if (highlightedIndex >= _opts.length) {
			highlightedIndex = _opts.length > 0 ? 0 : -1;
		}
	});
</script>

<div
	bind:this={containerRef}
	class={cn("relative", className)}
	role="combobox"
	aria-expanded={open}
	aria-haspopup="listbox"
	aria-disabled={disabled}
	aria-controls={open ? "search-select-listbox" : undefined}
	data-slot="search-select"
>
	<!-- Trigger / Search area -->
	<div
		class={cn(
			"flex min-h-8 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
			"focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
			"disabled:pointer-events-none disabled:opacity-50",
			"dark:bg-input/30 dark:disabled:bg-input/80",
			"md:text-sm",
			open && "border-ring ring-3 ring-ring/50"
		)}
	>
		<!-- Multiple selection chips -->
		{#if multiple && selectedOptions().length > 0}
			{#each selectedOptions() as option (option.value)}
				<span
					class="inline-flex items-center gap-0.5 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground"
				>
					{#if children}
						{@render children(option)}
					{:else}
						{option.label}
					{/if}
					<button
						type="button"
						tabindex={-1}
						class="ml-0.5 rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive"
						onclick={(e) => {
							e.stopPropagation();
							removeValue(option.value);
						}}
					>
						<XIcon class="size-3" />
					</button>
				</span>
			{/each}
		{/if}

		<!-- Search input (always present when open) -->
		{#if open}
			<input
				bind:this={searchInputRef}
				type="text"
				value={query}
				oninput={(e) => {
					query = (e.target as HTMLInputElement).value;
					handleQueryInput();
				}}
				onkeydown={handleKeydown}
				placeholder={searchPlaceholder}
				class="min-w-0 flex-1 bg-transparent py-0.5 text-base outline-none placeholder:text-muted-foreground md:text-sm"
				aria-label={searchPlaceholder}
			/>
		{:else}
			<!-- Display selected value or placeholder when closed -->
			<span class={cn("min-w-0 flex-1 truncate", selectedOptions().length > 0 ? "text-foreground" : "text-muted-foreground")}>
				{#if !multiple && selectedOptions().length > 0}
					{#if children}
						{@render children(selectedOptions()[0])}
					{:else}
						{selectedOptions()[0].label}
					{/if}
				{:else if multiple && selectedOptions().length > 0}
					<span class="text-xs text-muted-foreground">{selectedOptions().length} selected</span>
				{:else}
					{placeholder}
				{/if}
			</span>
		{/if}

		<!-- Right-side icons -->
		<div class="ml-auto flex shrink-0 items-center gap-1">
			{#if loading}
				<Loader2Icon class="size-4 animate-spin text-muted-foreground" />
			{/if}
			<button
				type="button"
				tabindex={-1}
				class="flex size-4 items-center justify-center rounded-sm hover:bg-muted"
				onclick={(e) => {
					e.stopPropagation();
					toggleOpen();
				}}
			>
				<ChevronDownIcon
					class={cn(
						"size-4 shrink-0 text-muted-foreground transition-transform",
						open && "rotate-180"
					)}
				/>
			</button>
		</div>
	</div>

	<!-- Dropdown -->
	{#if open}
		<div
			bind:this={listRef}
			role="listbox"
			id="search-select-listbox"
			data-slot="search-select-content"
			class={cn(
				"absolute top-full z-50 mt-1 max-h-64 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
				"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			)}
		>
			{#if loading && filteredOptions().length === 0}
				<div class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
					<Loader2Icon class="size-4 animate-spin" />
					<span>Loading...</span>
				</div>
			{:else if filteredOptions().length === 0}
				<div class="py-6 text-center text-sm text-muted-foreground">
					{emptyMessage}
				</div>
			{:else}
				{#each filteredOptions() as option, index (option.value)}
					<div
						role="option"
						data-index={index}
						data-selected={isSelected(option)}
						aria-selected={highlightedIndex === index}
						aria-disabled={option.disabled}
						tabindex={-1}
						class={cn(
							"flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none transition-colors",
							"hover:bg-accent hover:text-accent-foreground",
							highlightedIndex === index &&
								"bg-accent text-accent-foreground",
							option.disabled &&
								"pointer-events-none opacity-50",
							isSelected(option) && "font-medium"
						)}
						onmousedown={(e) => {
							e.preventDefault();
							selectOption(option);
						}}
						onmouseenter={() => (highlightedIndex = index)}
					>
						{#if children}
							<span class="flex-1 truncate">{@render children(option)}</span>
						{:else}
							<span class="flex-1 truncate">{option.label}</span>
						{/if}
						{#if isSelected(option)}
							<CheckIcon class="size-4 shrink-0 text-primary" />
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<script lang="ts">
  import {
    Combobox as ArkCombobox,
    createListCollection,
  } from "@ark-ui/svelte/combobox";
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

  const collection = $derived(
    createListCollection({
      items: options.map((o) => ({
        value: o.value,
        label: o.label,
        description: o.description,
      })),
    }),
  );

  let selectedLabel = $derived(
    options.find((o) => o.value === value)?.label ?? "",
  );

  function handleValueChange(details: { value: string[] }) {
    const newValue = details.value?.[0] ?? "";
    if (newValue === value) {
      value = "";
      onChange?.("");
    } else {
      value = newValue;
      onChange?.(newValue);
    }
    open = false;
  }

  function handleOpenChange(details: { open: boolean }) {
    open = details.open;
  }
</script>

<ArkCombobox.Root
  {collection}
  value={value ? [value] : []}
  onValueChange={handleValueChange}
  {open}
  onOpenChange={handleOpenChange}
  {disabled}
  loopFocus
>
  <ArkCombobox.Control>
    <ArkCombobox.Input
      {placeholder}
      class={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors",
        "placeholder:text-muted-foreground",
        "focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "bg-input/30",
        "[&>span]:line-clamp-1",
        className,
      )}
    />
    <ArkCombobox.Trigger class="absolute right-2 top-1/2 -translate-y-1/2">
      <ChevronsUpDownIcon
        class="size-4 shrink-0 text-muted-foreground opacity-50"
      />
    </ArkCombobox.Trigger>
  </ArkCombobox.Control>

  <ArkCombobox.Positioner>
    <ArkCombobox.Content
      class={cn(
        "z-50 w-(--combobox-anchor-width) p-0 origin-(--transform-origin)",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "rounded-lg border border-border bg-popover text-popover-foreground shadow-md",
      )}
    >
      <ArkCombobox.Empty class="py-6 text-center text-sm text-muted-foreground">
        No results found.
      </ArkCombobox.Empty>

      <ArkCombobox.ItemGroup>
        {#each collection.items as option (option.value)}
          <ArkCombobox.Item
            item={option}
            class={cn(
              "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none select-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
            )}
          >
            <span
              class="absolute left-2 flex size-3.5 items-center justify-center"
            >
              {#if value === option.value}
                <CheckIcon class="size-4" />
              {/if}
            </span>
            <span class="flex flex-1 flex-col gap-0.5">
              <span class="leading-none">{option.label}</span>
              {#if option.description}
                <span class="text-xs leading-snug text-muted-foreground"
                  >{option.description}</span
                >
              {/if}
            </span>
          </ArkCombobox.Item>
        {/each}
      </ArkCombobox.ItemGroup>
    </ArkCombobox.Content>
  </ArkCombobox.Positioner>
</ArkCombobox.Root>

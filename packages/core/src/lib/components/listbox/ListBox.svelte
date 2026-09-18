<script lang="ts" module>
  export type ListBoxOption = {
    value: string;
    label: string;
    disabled?: boolean;
    hidden?: boolean;
    group?: string;
    description?: string;
  };

  export type ListBoxGroup = {
    label: string;
    options: ListBoxOption[];
  };
</script>

<script lang="ts">
  import { tick } from "svelte";
  import { cn } from "$lib/utils.js";

  type Props = {
    options?: ListBoxOption[];
    groups?: ListBoxGroup[];
    value?: string | string[];
    multiple?: boolean;
    disabled?: boolean;
    class?: string;
    ariaLabel?: string;
    onChange?: (value: string | string[]) => void;
    onSelect?: (option: ListBoxOption) => void;
    children?: import("svelte").Snippet<[option: ListBoxOption]>;
  };

  let {
    options = [],
    groups = [],
    value = $bindable(""),
    multiple = false,
    disabled = false,
    class: className,
    ariaLabel = "List box",
    onChange,
    onSelect,
    children,
  }: Props = $props();

  let listRef = $state<HTMLDivElement | null>(null);
  let activeIndex = $state(-1);
  let typeahead = $state("");
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  let allOptions = $derived.by(() => {
    const grouped = groups.flatMap((group) =>
      group.options.map((option) => ({
        ...option,
        group: option.group ?? group.label,
      })),
    );
    return [...options, ...grouped];
  });
  let visibleOptions = $derived(allOptions.filter((option) => !option.hidden));
  let selectedValues = $derived(
    new Set(
      multiple
        ? Array.isArray(value)
          ? value
          : []
        : typeof value === "string" && value
          ? [value]
          : [],
    ),
  );
  let activeOption = $derived(
    activeIndex >= 0 ? visibleOptions[activeIndex] : undefined,
  );
  let groupsToRender = $derived.by(() => {
    const result: { label?: string; options: ListBoxOption[] }[] = [];
    for (const option of visibleOptions) {
      const last = result[result.length - 1];
      if (last && last.label === option.group) last.options.push(option);
      else result.push({ label: option.group, options: [option] });
    }
    return result;
  });

  function isSelected(option: ListBoxOption) {
    return selectedValues.has(option.value);
  }

  function firstEnabled(from = 0, direction = 1) {
    if (!visibleOptions.length) return -1;
    let index = from;
    for (let count = 0; count < visibleOptions.length; count++) {
      if (!visibleOptions[index]?.disabled) return index;
      index =
        (index + direction + visibleOptions.length) % visibleOptions.length;
    }
    return -1;
  }

  function setActive(index: number) {
    if (
      index < 0 ||
      index >= visibleOptions.length ||
      visibleOptions[index]?.disabled
    )
      return;
    activeIndex = index;
    tick().then(() =>
      listRef
        ?.querySelector(`[data-index="${index}"]`)
        ?.scrollIntoView?.({ block: "nearest" }),
    );
  }

  function selectOption(option: ListBoxOption) {
    if (disabled || option.disabled) return;
    let next: string | string[];
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      next = isSelected(option)
        ? current.filter((item) => item !== option.value)
        : [...current, option.value];
    } else {
      next = option.value;
    }
    value = next;
    onChange?.(next);
    onSelect?.(option);
  }

  function moveActive(direction: number) {
    if (!visibleOptions.length) return;
    const start =
      activeIndex < 0
        ? direction > 0
          ? 0
          : visibleOptions.length - 1
        : activeIndex + direction;
    let index = (start + visibleOptions.length) % visibleOptions.length;
    index = firstEnabled(index, direction) ?? -1;
    if (index >= 0) setActive(index);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
      event.preventDefault();
    switch (event.key) {
      case "ArrowDown":
        moveActive(1);
        break;
      case "ArrowUp":
        moveActive(-1);
        break;
      case "Home":
        setActive(firstEnabled(0, 1));
        break;
      case "End":
        setActive(firstEnabled(visibleOptions.length - 1, -1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeOption) selectOption(activeOption);
        break;
      default: {
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        )
          return;
        typeahead += event.key.toLocaleLowerCase();
        clearTimeout(typeaheadTimer);
        typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
        const start = activeIndex < 0 ? 0 : activeIndex + 1;
        const match = [
          ...visibleOptions.slice(start),
          ...visibleOptions.slice(0, start),
        ].findIndex(
          (option) =>
            !option.disabled &&
            option.label.toLocaleLowerCase().startsWith(typeahead),
        );
        if (match >= 0) setActive((start + match) % visibleOptions.length);
      }
    }
  }
</script>

<div
  bind:this={listRef}
  class={cn(
    "max-h-72 w-full overflow-y-auto rounded-md border border-input bg-background p-1 text-sm",
    className,
  )}
  role="listbox"
  tabindex={disabled ? -1 : 0}
  aria-label={ariaLabel}
  aria-disabled={disabled}
  aria-multiselectable={multiple}
  onkeydown={handleKeydown}
>
  {#if !visibleOptions.length}
    <div class="px-2 py-6 text-center text-muted-foreground" aria-hidden="true">
      No options
    </div>
  {:else}
    {#each groupsToRender as group}
      {#if group.label}<div
          class="px-2 pb-1 pt-2 text-xs font-medium text-muted-foreground"
          role="presentation"
        >
          {group.label}
        </div>{/if}
      {#each group.options as option (option.value)}
        {@const index = visibleOptions.indexOf(option)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          role="option"
          data-index={index}
          aria-selected={isSelected(option)}
          aria-disabled={option.disabled}
          tabindex={-1}
          class={cn(
            "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 outline-none",
            activeIndex === index && "bg-accent text-accent-foreground",
            option.disabled && "pointer-events-none opacity-50",
            isSelected(option) && "font-medium",
          )}
          onclick={() => selectOption(option)}
          onmouseenter={() => !option.disabled && setActive(index)}
        >
          <span class="min-w-0 flex-1 truncate"
            >{#if children}{@render children(
                option,
              )}{:else}{option.label}{/if}</span
          >
          {#if isSelected(option)}<span aria-hidden="true">✓</span>{/if}
        </div>
      {/each}
    {/each}
  {/if}
</div>

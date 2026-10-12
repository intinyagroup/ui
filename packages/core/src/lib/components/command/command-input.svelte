<script lang="ts">
  import * as InputGroup from "$lib/components/input-group/index.js";
  import SearchIcon from "@lucide/svelte/icons/search";
  import { cn } from "$lib/utils.js";
  import { getCommandContext } from "./command-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(""),
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    value?: string;
    [key: string]: any;
  } = $props();

  const ctx = getCommandContext();

  $effect(() => {
    ctx.setSearch(value);
  });

  $effect(() => {
    if (ref) ctx.setInputNode(ref);
  });

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = target.value;
    ctx.setSearch(target.value);
    ctx.setSelectedIndex(0);
  }
</script>

<div data-slot="command-input-wrapper" class="p-1 pb-0">
  <InputGroup.Root
    class="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!"
  >
    <InputGroup.Input
      bind:ref
      data-slot="command-input"
      {value}
      oninput={handleInput}
      class={cn(
        "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...restProps}
    />
    <InputGroup.Addon>
      <SearchIcon class="size-4 shrink-0 opacity-50" />
    </InputGroup.Addon>
  </InputGroup.Root>
</div>

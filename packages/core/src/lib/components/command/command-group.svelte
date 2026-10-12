<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { getCommandContext } from "./command-context.svelte.js";
  import type { Snippet } from "svelte";

  let groupUid = 0;

  let {
    ref = $bindable(null),
    class: className,
    children,
    heading,
    value,
    forceMount = false,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    children?: Snippet;
    heading?: string;
    value?: string;
    forceMount?: boolean;
    [key: string]: any;
  } = $props();

  const ctx = getCommandContext();
  const resolvedValue = $derived(
    value ?? heading ?? `__cmd_group_${++groupUid}`,
  );

  $effect(() => {
    ctx.registerGroup({ value: resolvedValue, heading, el: ref!, forceMount });
    return () => ctx.unregisterGroup(resolvedValue);
  });

  const visible = $derived(
    forceMount || ctx.filtered.groups.has(resolvedValue),
  );
</script>

{#if visible}
  <div
    bind:this={ref}
    data-slot="command-group"
    role="group"
    class={cn(
      "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...restProps}
  >
    {#if heading}
      <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        {heading}
      </div>
    {/if}
    {@render children?.()}
  </div>
{/if}

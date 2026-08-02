<script lang="ts" generics="TData">
  import type { Snippet } from 'svelte';
  import type { Row } from '@tanstack/table-core';

  let {
    row,
    expanded,
    detail,
    selectable,
    columnCount,
  }: {
    row: Row<TData>;
    expanded: boolean;
    detail?: Snippet<[{ row: TData; rowIndex: number }]>;
    selectable: boolean;
    columnCount: number;
  } = $props();
</script>

{#if expanded && detail}
  <tr class="border-t border-[var(--ui-border)]/50 bg-[var(--ui-secondary)]/20">
    <td colspan={columnCount + (selectable ? 1 : 0)} class="p-4">
      {@render detail({ row: row.original, rowIndex: row.index })}
    </td>
  </tr>
{/if}

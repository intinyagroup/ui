<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children
  }: {
    children?: Snippet;
  } = $props();
</script>

<div class="pointer-events-none absolute inset-0 z-50">
  {@render children?.()}
</div>

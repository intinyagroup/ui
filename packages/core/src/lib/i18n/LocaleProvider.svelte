<script lang="ts">
  import { setLocale, type LocaleConfig } from './locale.svelte.js';

  let {
    config,
    children
  }: {
    config: LocaleConfig;
    children?: import('svelte').Snippet;
  } = $props();

  $effect(() => {
    setLocale(config);
  });
</script>

{@render children?.()}

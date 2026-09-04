<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let {
    color = 'var(--flat-blue)',
    flip = false,
    height = '150px',
    children,
    class: className,
  }: {
    color?: string;
    flip?: boolean;
    height?: string;
    children?: Snippet;
    class?: string;
  } = $props();
</script>

<section
  class={cn('relative w-full overflow-hidden', flip && 'flex flex-col justify-end', className)}
  style:background-color={color}
>
  {#if flip}
    {#if children}
      <div class="relative z-10">
        {@render children()}
      </div>
    {/if}
    <svg
      class="absolute bottom-0 left-0 block w-full"
      style:height
      viewBox="0 0 1440 150"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,64 C180,120 360,0 540,64 C720,128 900,0 1080,64 C1260,128 1380,96 1440,64 L1440,150 L0,150 Z"
        fill="currentColor"
      />
    </svg>
  {:else}
    <svg
      class="absolute top-0 left-0 block w-full"
      style:height
      viewBox="0 0 1440 150"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,64 C180,120 360,0 540,64 C720,128 900,0 1080,64 C1260,128 1380,96 1440,64 L1440,0 L0,0 Z"
        fill="currentColor"
      />
    </svg>
    {#if children}
      <div class="relative z-10">
        {@render children()}
      </div>
    {/if}
  {/if}
</section>

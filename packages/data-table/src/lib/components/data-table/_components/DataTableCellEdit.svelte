<script lang="ts">
  import { onMount } from 'svelte';

  let {
    value,
    editable = false,
    onCommit,
    onCancel,
  }: {
    value: unknown;
    editable?: boolean;
    onCommit: (newValue: unknown) => void;
    onCancel: () => void;
  } = $props();

  let editing = $state(false);
  let editValue = $state(String(value ?? ''));
  let inputEl: HTMLInputElement | null = $state(null);

  $effect(() => {
    if (editing && inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  });

  function startEdit() {
    if (!editable) return;
    editValue = String(value ?? '');
    editing = true;
  }

  function commit() {
    editing = false;
    if (editValue !== String(value ?? '')) {
      onCommit(editValue);
    }
  }

  function cancel() {
    editing = false;
    editValue = String(value ?? '');
    onCancel();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }
</script>

{#if editing}
  <input
    bind:this={inputEl}
    type="text"
    value={editValue}
    oninput={(e) => { editValue = e.currentTarget.value; }}
    onblur={commit}
    onkeydown={handleKeydown}
    class="w-full h-7 px-2 rounded-md border border-[var(--ui-primary)] bg-[var(--ui-background)] text-sm text-[var(--ui-foreground)] outline-none ring-2 ring-[var(--ui-ring)]/20"
  />
{:else}
  {#if editable}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <span
      role="button"
      tabindex="0"
      class="cursor-pointer hover:bg-[var(--ui-secondary)] rounded px-1 -mx-1 min-h-[28px] inline-flex items-center"
      onclick={startEdit}
      ondblclick={startEdit}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startEdit();
        }
      }}
    >
      {value ?? '-'}
    </span>
  {:else}
    <span>{value ?? '-'}</span>
  {/if}
{/if}

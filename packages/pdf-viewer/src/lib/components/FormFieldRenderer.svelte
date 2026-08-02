<script lang="ts">
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { FormField } from '../pdf-core.js';

  let {
    field,
    scale = 1,
    onValueChange,
  }: {
    field: FormField;
    scale?: number;
    onValueChange: (id: string, value: string | boolean) => void;
  } = $props();

  let localValue = $state(field.value);

  $effect(() => {
    localValue = field.value;
  });

  function handleTextChange(value: string) {
    localValue = value;
    onValueChange(field.id, value);
  }

  function handleCheckChange(checked: boolean) {
    onValueChange(field.id, checked ? field.exportValue ?? 'Yes' : 'Off');
  }

  function handleSelectChange(value: string) {
    localValue = value;
    onValueChange(field.id, value);
  }
</script>

<div
  class="absolute"
  style="left: {field.x * scale}px; top: {field.y * scale}px; width: {field.width * scale}px; height: {field.height * scale}px;"
>
  {#if field.type === 'text'}
    <input
      type="text"
      value={localValue}
      oninput={(e) => handleTextChange(e.currentTarget.value)}
      placeholder={field.alternateName ?? field.name}
      readonly={field.readOnly}
      class="w-full h-full px-1 border border-[var(--ui-border)] rounded text-sm bg-transparent text-[var(--ui-foreground)] outline-none focus:border-[var(--ui-primary)] focus:ring-1 focus:ring-[var(--ui-ring)]/20
        {field.readOnly ? 'opacity-70 cursor-not-allowed' : ''}"
      style="font-size: {(field.fontSize ?? 12) * scale}px; text-align: {field.textAlign ?? 'left'};"
    />

  {:else if field.type === 'checkbox'}
    <label class="flex items-center gap-1.5 h-full cursor-pointer">
      <input
        type="checkbox"
        checked={field.value === (field.exportValue ?? 'Yes')}
        onchange={(e) => handleCheckChange(e.currentTarget.checked)}
        disabled={field.readOnly}
        class="size-4 accent-[var(--ui-primary)]"
      />
      {#if field.alternateName}
        <span class="text-xs text-[var(--ui-foreground)]">{field.alternateName}</span>
      {/if}
    </label>

  {:else if field.type === 'radio'}
    <label class="flex items-center gap-1.5 h-full cursor-pointer">
      <input
        type="radio"
        name={field.name}
        value={field.exportValue ?? field.name}
        checked={field.value === field.exportValue}
        onchange={() => onValueChange(field.id, field.exportValue ?? field.name)}
        disabled={field.readOnly}
        class="size-4 accent-[var(--ui-primary)]"
      />
      {#if field.alternateName}
        <span class="text-xs text-[var(--ui-foreground)]">{field.alternateName}</span>
      {/if}
    </label>

  {:else if field.type === 'dropdown'}
    <select
      value={localValue}
      onchange={(e) => handleSelectChange(e.currentTarget.value)}
      disabled={field.readOnly}
      class="w-full h-full px-1 border border-[var(--ui-border)] rounded text-sm bg-transparent text-[var(--ui-foreground)] outline-none focus:border-[var(--ui-primary)] cursor-pointer
        {field.readOnly ? 'opacity-70 cursor-not-allowed' : ''}"
    >
      <option value="">Select...</option>
      {#each field.options ?? [] as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>

  {:else if field.type === 'listbox'}
    <select
      multiple
      value={localValue.split(',')}
      onchange={(e) => handleSelectChange(Array.from(e.currentTarget.selectedOptions, (o) => o.value).join(','))}
      disabled={field.readOnly}
      class="w-full h-full px-1 border border-[var(--ui-border)] rounded text-sm bg-transparent text-[var(--ui-foreground)] outline-none focus:border-[var(--ui-primary)] overflow-auto
        {field.readOnly ? 'opacity-70 cursor-not-allowed' : ''}"
    >
      {#each field.options ?? [] as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>

  {:else if field.type === 'signature'}
    <div
      class="w-full h-full border-2 border-dashed border-[var(--ui-border)] rounded flex items-center justify-center cursor-pointer hover:border-[var(--ui-primary)]/50 transition-colors"
      role="button"
      tabindex={0}
    >
      {#if field.signatureData}
        <img src={field.signatureData} alt="Signature" class="max-w-full max-h-full object-contain" />
      {:else}
        <span class="text-xs text-[var(--ui-muted-foreground)]">Click to sign</span>
      {/if}
    </div>

  {:else if field.type === 'image'}
    <div
      class="w-full h-full border border-[var(--ui-border)] rounded flex items-center justify-center overflow-hidden"
    >
      {#if field.value}
        <img src={field.value} alt={field.name} class="w-full h-full object-contain" />
      {:else}
        <span class="text-xs text-[var(--ui-muted-foreground)]">Click to add image</span>
      {/if}
    </div>

  {:else}
    <div class="w-full h-full border border-[var(--ui-border)] rounded flex items-center justify-center">
      <span class="text-xs text-[var(--ui-muted-foreground)]">{field.type}</span>
    </div>
  {/if}
</div>

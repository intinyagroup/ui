<script lang="ts">
  import { Settings, Image, Upload } from 'lucide-svelte';
  import { Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { fontOptions, type BookMetadata, type BookLayout } from '../book-model.js';

  let {
    metadata,
    layout,
    onMetadataChange,
    onLayoutChange,
  }: {
    metadata: BookMetadata;
    layout: BookLayout;
    onMetadataChange: (metadata: BookMetadata) => void;
    onLayoutChange: (layout: BookLayout) => void;
  } = $props();

  let activeTab = $state<'metadata' | 'layout' | 'typography'>('metadata');
  let coverPreview = $state(metadata.coverImage || '');

  function updateMetadata(field: keyof BookMetadata, value: string) {
    onMetadataChange({ ...metadata, [field]: value });
  }

  function updateLayout(field: keyof BookLayout, value: any) {
    onLayoutChange({ ...layout, [field]: value });
  }

  function handleCoverUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      coverPreview = dataUrl;
      updateMetadata('coverImage', dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function removeCover() {
    coverPreview = '';
    updateMetadata('coverImage', '');
  }
</script>

<div class="w-72 border-l border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col shrink-0">
  <div class="px-3 py-2.5 border-b border-[var(--ui-border)]">
    <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">
      <Settings class="size-4 inline mr-1" />
      Book Settings
    </h3>
  </div>

  <!-- Tabs -->
  <div class="flex border-b border-[var(--ui-border)]">
    {#each [
      { id: 'metadata', label: 'Info' },
      { id: 'layout', label: 'Layout' },
      { id: 'typography', label: 'Type' },
    ] as tab}
      <button
        onclick={() => activeTab = tab.id as typeof activeTab}
        class={cn(
          "flex-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer",
          activeTab === tab.id
            ? "text-[var(--ui-primary)] border-b-2 border-[var(--ui-primary)]"
            : "text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]"
        )}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-auto p-3 space-y-3">
    {#if activeTab === 'metadata'}
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Title
        <Input bind:value={metadata.title} class="mt-1 h-8 text-sm" oninput={(e) => updateMetadata('title', e.currentTarget.value)} />
      </label>
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Subtitle
        <Input bind:value={metadata.subtitle} class="mt-1 h-8 text-sm" oninput={(e) => updateMetadata('subtitle', e.currentTarget.value)} />
      </label>
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Author
        <Input bind:value={metadata.author} class="mt-1 h-8 text-sm" oninput={(e) => updateMetadata('author', e.currentTarget.value)} />
      </label>
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        ISBN
        <Input bind:value={metadata.isbn} class="mt-1 h-8 text-sm" oninput={(e) => updateMetadata('isbn', e.currentTarget.value)} />
      </label>
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Publisher
        <Input bind:value={metadata.publisher} class="mt-1 h-8 text-sm" oninput={(e) => updateMetadata('publisher', e.currentTarget.value)} />
      </label>

      <!-- Cover image upload -->
      <div class="block text-xs text-[var(--ui-muted-foreground)]">
        Cover Image
        {#if coverPreview}
          <div class="mt-1 relative">
            <img src={coverPreview} alt="Cover preview" class="w-full h-24 object-cover rounded border border-[var(--ui-border)]" />
            <button
              onclick={removeCover}
              class="absolute top-1 right-1 p-1 rounded bg-[var(--ui-destructive)] text-white text-xs cursor-pointer"
            >×</button>
          </div>
        {:else}
          <label class="mt-1 flex items-center justify-center gap-2 h-16 border-2 border-dashed border-[var(--ui-border)] rounded-lg cursor-pointer hover:border-[var(--ui-primary)]/50 transition-colors">
            <Upload class="size-4" />
            <span>Upload cover</span>
            <input type="file" accept="image/*" class="hidden" onchange={handleCoverUpload} />
          </label>
        {/if}
      </div>

    {:else if activeTab === 'layout'}
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Page Size
        <select
          bind:value={layout.pageSize}
          onchange={(e) => updateLayout('pageSize', e.currentTarget.value)}
          class="w-full mt-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-sm"
        >
          <option value="a4">A4</option>
          <option value="a5">A5 (Novel)</option>
          <option value="letter">US Letter</option>
          <option value="legal">US Legal</option>
        </select>
      </label>

      <div class="grid grid-cols-2 gap-2">
        <label class="block text-xs text-[var(--ui-muted-foreground)]">
          Top margin
          <input type="number" bind:value={layout.marginTop} class="w-full mt-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-sm" />
        </label>
        <label class="block text-xs text-[var(--ui-muted-foreground)]">
          Bottom margin
          <input type="number" bind:value={layout.marginBottom} class="w-full mt-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-sm" />
        </label>
        <label class="block text-xs text-[var(--ui-muted-foreground)]">
          Left margin
          <input type="number" bind:value={layout.marginLeft} class="w-full mt-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-sm" />
        </label>
        <label class="block text-xs text-[var(--ui-muted-foreground)]">
          Right margin
          <input type="number" bind:value={layout.marginRight} class="w-full mt-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-sm" />
        </label>
      </div>

      <label class="flex items-center gap-2 text-xs cursor-pointer">
        <input type="checkbox" bind:checked={layout.chapterStartOnNewPage} class="accent-[var(--ui-primary)]" />
        Chapter starts on new page
      </label>

      <label class="flex items-center gap-2 text-xs cursor-pointer">
        <input type="checkbox" bind:checked={layout.showPageNumbers} class="accent-[var(--ui-primary)]" />
        Show page numbers
      </label>

      <label class="flex items-center gap-2 text-xs cursor-pointer">
        <input type="checkbox" bind:checked={layout.showHeaders} class="accent-[var(--ui-primary)]" />
        Show headers
      </label>

      <label class="flex items-center gap-2 text-xs cursor-pointer">
        <input type="checkbox" bind:checked={layout.generateTOC} class="accent-[var(--ui-primary)]" />
        Generate Table of Contents
      </label>

      <label class="flex items-center gap-2 text-xs cursor-pointer">
        <input type="checkbox" bind:checked={layout.showCoverPage} class="accent-[var(--ui-primary)]" />
        Show cover page
      </label>

    {:else if activeTab === 'typography'}
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Font Family
        <select
          bind:value={layout.fontFamily}
          onchange={(e) => updateLayout('fontFamily', e.currentTarget.value)}
          class="w-full mt-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-sm"
        >
          {#each fontOptions as font}
            <option value={font.value}>{font.label}</option>
          {/each}
        </select>
      </label>

      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Font Size: {layout.fontSize}pt
        <input type="range" bind:value={layout.fontSize} min={8} max={16} step={0.5} class="w-full mt-1" />
      </label>

      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Line Height: {layout.lineHeight}
        <input type="range" bind:value={layout.lineHeight} min={1} max={2.5} step={0.1} class="w-full mt-1" />
      </label>

      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Chapter Title Size: {layout.chapterTitleSize}pt
        <input type="range" bind:value={layout.chapterTitleSize} min={16} max={36} step={1} class="w-full mt-1" />
      </label>

      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Chapter Title Align
        <select
          bind:value={layout.chapterTitleAlign}
          onchange={(e) => updateLayout('chapterTitleAlign', e.currentTarget.value)}
          class="w-full mt-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    {/if}
  </div>
</div>

<script lang="ts">
  import { Upload, Image, Film, Music, FileText } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';

  let {
    onSelect,
  }: {
    onSelect: (url: string) => void;
  } = $props();

  let files = $state<{ name: string; url: string; type: string }[]>([]);
  let dragging = $state(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    const droppedFiles = e.dataTransfer?.files;
    if (!droppedFiles) return;
    for (const file of Array.from(droppedFiles)) {
      const url = URL.createObjectURL(file);
      files = [...files, { name: file.name, url, type: file.type }];
    }
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    for (const file of Array.from(input.files)) {
      const url = URL.createObjectURL(file);
      files = [...files, { name: file.name, url, type: file.type }];
    }
  }

  function getIcon(type: string) {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    return FileText;
  }
</script>

<div class="w-48 border-r border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col shrink-0">
  <div class="px-3 py-2 border-b border-[var(--ui-border)]">
    <span class="text-xs font-semibold text-[var(--ui-foreground)]">Assets</span>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="m-2 p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
      {dragging ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/5' : 'border-[var(--ui-border)] hover:border-[var(--ui-primary)]/50'}"
    ondragover={(e) => { e.preventDefault(); dragging = true; }}
    ondragleave={() => dragging = false}
    ondrop={handleDrop}
    onclick={() => document.getElementById('asset-file-input')?.click()}
  >
    <Upload class="size-5 mx-auto mb-1 text-[var(--ui-muted-foreground)]" />
    <span class="text-[10px] text-[var(--ui-muted-foreground)]">Drop files</span>
  </div>
  <input id="asset-file-input" type="file" multiple accept="image/*,video/*,audio/*" class="hidden" onchange={handleFileSelect} />

  <div class="flex-1 overflow-auto p-2 space-y-1">
    {#each files as file}
      {@const Icon = getIcon(file.type)}
      <button
        class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
        onclick={() => onSelect(file.url)}
      >
        <Icon class="size-4 text-[var(--ui-muted-foreground)] shrink-0" />
        <span class="text-xs truncate">{file.name}</span>
      </button>
    {/each}

    {#if files.length === 0}
      <div class="text-center py-8 text-[10px] text-[var(--ui-muted-foreground)]">
        No assets yet
      </div>
    {/if}
  </div>
</div>

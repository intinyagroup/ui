<script lang="ts">
  import { Plus, Trash2, GripVertical, FileText, Merge } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  type MergeDocument = {
    id: string;
    name: string;
    pageCount: number;
    size: number;
    file: File | string;
    thumbnail?: string;
  };

  let {
    documents = [],
    onAddDocuments,
    onRemoveDocument,
    onReorderDocuments,
    onMerge,
    merging,
  }: {
    documents: MergeDocument[];
    onAddDocuments: (files: FileList) => void;
    onRemoveDocument: (id: string) => void;
    onReorderDocuments: (fromIndex: number, toIndex: number) => void;
    onMerge: () => void;
    merging: boolean;
  } = $props();

  let fileInput: HTMLInputElement | null = null;
  let dragOverIndex = $state(-1);

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function handleDragStart(e: DragEvent, index: number) {
    e.dataTransfer?.setData('text/plain', String(index));
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex = index;
  }

  function handleDrop(e: DragEvent, toIndex: number) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') ?? '-1');
    if (fromIndex >= 0 && fromIndex !== toIndex) {
      onReorderDocuments(fromIndex, toIndex);
    }
    dragOverIndex = -1;
  }

  function triggerUpload() { fileInput?.click(); }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      onAddDocuments(input.files);
      input.value = '';
    }
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2">
    <Merge class="size-5 text-[var(--ui-primary)]" />
    <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Merge PDFs</h3>
  </div>

  <p class="text-xs text-[var(--ui-muted-foreground)]">
    Combine multiple PDF documents into a single file. Drag to reorder.
  </p>

  <Button size="sm" class="w-full" onclick={triggerUpload}>
    <Plus class="size-4 mr-2" /> Add PDF Files
  </Button>
  <input
    bind:this={fileInput}
    type="file"
    accept=".pdf"
    multiple
    class="hidden"
    onchange={handleFileChange}
  />

  <!-- Document list -->
  {#if documents.length > 0}
    <div class="space-y-2">
      {#each documents as doc, index (doc.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          draggable="true"
          ondragstart={(e) => handleDragStart(e, index)}
          ondragover={(e) => handleDragOver(e, index)}
          ondrop={(e) => handleDrop(e, index)}
          class={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-colors",
            dragOverIndex === index
              ? "border-[var(--ui-primary)] border-dashed bg-[var(--ui-primary)]/5"
              : "border-[var(--ui-border)] bg-[var(--ui-card)]"
          )}
        >
          <GripVertical class="size-4 text-[var(--ui-muted-foreground)] cursor-grab shrink-0" />

          <div class="flex items-center justify-center size-10 rounded bg-[var(--ui-secondary)] shrink-0">
            <FileText class="size-5 text-[var(--ui-muted-foreground)]" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-[var(--ui-foreground)] truncate">{doc.name}</div>
            <div class="text-xs text-[var(--ui-muted-foreground)]">
              {doc.pageCount} pages · {formatSize(doc.size)}
            </div>
          </div>

          <div class="text-xs text-[var(--ui-muted-foreground)] font-mono">
            #{index + 1}
          </div>

          <button
            onclick={() => onRemoveDocument(doc.id)}
            class="p-1 rounded text-[var(--ui-muted-foreground)] hover:text-[var(--ui-destructive)] hover:bg-[var(--ui-destructive)]/10 cursor-pointer shrink-0"
          >
            <Trash2 class="size-4" />
          </button>
        </div>
      {/each}
    </div>

    <!-- Summary -->
    <div class="flex items-center justify-between p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/20">
      <div class="text-sm text-[var(--ui-muted-foreground)]">
        Total: {documents.length} document(s), {documents.reduce((sum, d) => sum + d.pageCount, 0)} pages
      </div>
    </div>

    <Button
      size="sm"
      class="w-full"
      onclick={onMerge}
      disabled={merging || documents.length < 2}
    >
      {#if merging}
        Merging...
      {:else}
        <Merge class="size-4 mr-2" /> Merge {documents.length} Documents
      {/if}
    </Button>
  {:else}
    <div class="text-center py-8 text-sm text-[var(--ui-muted-foreground)]">
      No documents added yet. Click "Add PDF Files" to start.
    </div>
  {/if}
</div>

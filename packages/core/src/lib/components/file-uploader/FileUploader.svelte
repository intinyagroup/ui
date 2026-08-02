<script lang="ts">
  import { Upload, X, File, Image, FileText, FileVideo, FileAudio } from 'lucide-svelte';
  import { Button } from '../../button/index.js';
  import { cn } from '../../utils.js';

  type FileItem = {
    id: string;
    file: File;
    preview?: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
  };

  let {
    accept = '*',
    multiple = true,
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024,
    disabled = false,
    class: className,
    onUpload,
    onFilesChange,
  }: {
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    class?: string;
    onUpload?: (files: File[]) => Promise<void>;
    onFilesChange?: (files: FileItem[]) => void;
  } = $props();

  let files = $state<FileItem[]>([]);
  let dragOver = $state(false);
  let fileInput: HTMLInputElement | null = null;

  function getFileIcon(file: File) {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return FileVideo;
    if (file.type.startsWith('audio/')) return FileAudio;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    return File;
  }

  function formatSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function generateId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList);

    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize) return false;
      return true;
    }).slice(0, maxFiles - files.length);

    const items: FileItem[] = validFiles.map((file) => ({
      id: generateId(),
      file,
      status: 'pending' as const,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    files = [...files, ...items];
    onFilesChange?.(files);
  }

  function removeFile(id: string) {
    const item = files.find((f) => f.id === id);
    if (item?.preview) URL.revokeObjectURL(item.preview);
    files = files.filter((f) => f.id !== id);
    onFilesChange?.(files);
  }

  async function handleUpload() {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (!pendingFiles.length || !onUpload) return;

    for (const item of pendingFiles) {
      item.status = 'uploading';
      item.progress = 0;
      files = [...files];
    }

    try {
      await onUpload(pendingFiles.map((f) => f.file));
      for (const item of pendingFiles) {
        item.status = 'success';
        item.progress = 100;
      }
    } catch (err) {
      for (const item of pendingFiles) {
        item.status = 'error';
        item.error = err instanceof Error ? err.message : 'Upload failed';
      }
    }
    files = [...files];
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    dragOver = true;
  }

  function handleDragLeave() { dragOver = false; }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    addFiles(e.dataTransfer?.files ?? null);
  }

  function triggerUpload() { fileInput?.click(); }
</script>

<div class={cn('grid gap-4', className)}>
  <!-- Drop zone -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer
      {dragOver ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/5' : 'border-[var(--ui-border)] hover:border-[var(--ui-primary)]/50 hover:bg-[var(--ui-secondary)]/30'}
      {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={triggerUpload}
  >
    <Upload class="size-8 text-[var(--ui-muted-foreground)]" />
    <div class="text-center">
      <p class="text-sm font-medium text-[var(--ui-foreground)]">
        Drop files here or <span class="text-[var(--ui-primary)]">browse</span>
      </p>
      <p class="text-xs text-[var(--ui-muted-foreground)] mt-1">
        {multiple ? `Up to ${maxFiles} files` : '1 file'} · Max {formatSize(maxSize)}
      </p>
    </div>
  </div>

  <input
    bind:this={fileInput}
    type="file"
    {accept}
    {multiple}
    {disabled}
    class="hidden"
    onchange={(e) => addFiles(e.currentTarget.files)}
  />

  <!-- File list -->
  {#if files.length > 0}
    <div class="grid gap-2">
      {#each files as item (item.id)}
        {@const Icon = getFileIcon(item.file)}
        <div class="flex items-center gap-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] p-3">
          {#if item.preview}
            <img src={item.preview} alt={item.file.name} class="size-10 rounded-md object-cover" />
          {:else}
            <div class="flex items-center justify-center size-10 rounded-md bg-[var(--ui-secondary)]">
              <Icon class="size-5 text-[var(--ui-muted-foreground)]" />
            </div>
          {/if}

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-[var(--ui-foreground)] truncate">{item.file.name}</p>
            <p class="text-xs text-[var(--ui-muted-foreground)]">{formatSize(item.file.size)}</p>
            {#if item.status === 'uploading' && item.progress !== undefined}
              <div class="mt-1 h-1.5 rounded-full bg-[var(--ui-secondary)] overflow-hidden">
                <div class="h-full rounded-full bg-[var(--ui-primary)] transition-all" style="width: {item.progress}%"></div>
              </div>
            {/if}
            {#if item.error}
              <p class="text-xs text-[var(--ui-destructive)] mt-1">{item.error}</p>
            {/if}
          </div>

          <div class="shrink-0">
            {#if item.status === 'success'}
              <span class="text-xs text-[var(--ui-success)] font-medium">✓ Done</span>
            {:else}
              <button
                onclick={() => removeFile(item.id)}
                class="p-1 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
                aria-label="Remove file"
              >
                <X class="size-4" />
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-between">
      <p class="text-xs text-[var(--ui-muted-foreground)]">{files.length} file(s) selected</p>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" onclick={() => { files = []; onFilesChange?.([]); }}>
          Clear all
        </Button>
        {#if onUpload}
          <Button size="sm" onclick={handleUpload} disabled={files.every((f) => f.status !== 'pending')}>
            Upload {files.filter((f) => f.status === 'pending').length || ''} file(s)
          </Button>
        {/if}
      </div>
    </div>
  {/if}
</div>

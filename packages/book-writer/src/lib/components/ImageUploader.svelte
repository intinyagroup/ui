<script lang="ts">
  import { Upload, X, Image, Link, AlignLeft, AlignCenter, AlignRight, Maximize } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    onInsert,
    onClose,
  }: {
    onInsert: (image: { src: string; alt: string; width: string; align: string; caption?: string }) => void;
    onClose: () => void;
  } = $props();

  let mode = $state<'url' | 'upload'>('url');
  let imageUrl = $state('');
  let imageAlt = $state('');
  let imageWidth = $state('100');
  let imageAlign = $state('center');
  let imageCaption = $state('');
  let dragOver = $state(false);
  let uploading = $state(false);
  let previewUrl = $state('');

  function handleInsert() {
    if (!imageUrl && !previewUrl) return;
    onInsert({
      src: previewUrl || imageUrl,
      alt: imageAlt || 'Image',
      width: imageWidth + '%',
      align: imageAlign,
      caption: imageCaption || undefined,
    });
  }

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return;
    uploading = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl = e.target?.result as string;
      imageUrl = previewUrl;
      uploading = false;
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) handleFileSelect(file);
  }

  function handleFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) handleFileSelect(file);
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-[var(--ui-card)] rounded-xl p-6 w-[480px] shadow-xl max-h-[80vh] overflow-auto">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-[var(--ui-foreground)]">Insert Image</h3>
      <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
        <X class="size-5" />
      </button>
    </div>

    <!-- Mode toggle -->
    <div class="flex gap-2 mb-4">
      <button
        onclick={() => mode = 'url'}
        class={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer",
          mode === 'url' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]"
        )}
      >
        <Link class="size-4" /> URL
      </button>
      <button
        onclick={() => mode = 'upload'}
        class={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer",
          mode === 'upload' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]"
        )}
      >
        <Upload class="size-4" /> Upload
      </button>
    </div>

    {#if mode === 'url'}
      <Input bind:value={imageUrl} placeholder="https://example.com/image.jpg" class="mb-3" />
    {:else}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="border-2 border-dashed rounded-lg p-6 text-center mb-3 cursor-pointer transition-colors
          {dragOver ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/5' : 'border-[var(--ui-border)] hover:border-[var(--ui-primary)]/50'}"
        ondragover={(e) => { e.preventDefault(); dragOver = true; }}
        ondragleave={() => dragOver = false}
        ondrop={handleDrop}
        onclick={() => document.getElementById('image-file-input')?.click()}
      >
        {#if uploading}
          <span class="text-sm text-[var(--ui-muted-foreground)]">Uploading...</span>
        {:else if previewUrl}
          <img src={previewUrl} alt="Preview" class="max-h-32 mx-auto rounded" />
        {:else}
          <Upload class="size-8 mx-auto mb-2 text-[var(--ui-muted-foreground)]" />
          <span class="text-sm text-[var(--ui-muted-foreground)]">Drop image or click to browse</span>
        {/if}
      </div>
      <input id="image-file-input" type="file" accept="image/*" class="hidden" onchange={handleFileInput} />
    {/if}

    <!-- Options -->
    <div class="space-y-3">
      <Input bind:value={imageAlt} placeholder="Alt text (for accessibility)" />

      <div class="grid grid-cols-2 gap-3">
        <label class="block text-xs text-[var(--ui-muted-foreground)]">
          Width (%)
          <Input bind:value={imageWidth} type="number" min={10} max={100} class="mt-1" />
        </label>
        <div class="block text-xs text-[var(--ui-muted-foreground)]">
          Alignment
          <div class="flex gap-1 mt-1">
            <button onclick={() => imageAlign = 'left'} class={cn("p-2 rounded border", imageAlign === 'left' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]")}><AlignLeft class="size-4" /></button>
            <button onclick={() => imageAlign = 'center'} class={cn("p-2 rounded border", imageAlign === 'center' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]")}><AlignCenter class="size-4" /></button>
            <button onclick={() => imageAlign = 'right'} class={cn("p-2 rounded border", imageAlign === 'right' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]")}><AlignRight class="size-4" /></button>
            <button onclick={() => imageAlign = 'full'} class={cn("p-2 rounded border", imageAlign === 'full' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]")}><Maximize class="size-4" /></button>
          </div>
        </div>
      </div>

      <Input bind:value={imageCaption} placeholder="Caption (optional)" />
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <Button variant="outline" onclick={onClose}>Cancel</Button>
      <Button onclick={handleInsert} disabled={!imageUrl && !previewUrl}>
        <Image class="size-4 mr-2" /> Insert Image
      </Button>
    </div>
  </div>
</div>

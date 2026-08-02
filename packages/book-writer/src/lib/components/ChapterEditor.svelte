<script lang="ts">
  import { Pencil, Image, Hash } from 'lucide-svelte';
  import { RichTextEditor } from '@intinyagroup/rich-text';
  import { Button } from '@intinyagroup/ui';
  import type { Chapter } from '../book-model.js';
  import { getNextFootnoteNumber, addFootnoteDefinition } from '../footnote-utils.js';
  import ImageUploader from './ImageUploader.svelte';

  let {
    chapter,
    onContentChange,
    onTitleChange,
  }: {
    chapter: Chapter;
    onContentChange: (content: string) => void;
    onTitleChange: (title: string) => void;
  } = $props();

  let editingTitle = $state(false);
  let titleValue = $state(chapter.title);
  let showImageUploader = $state(false);
  let showFootnoteDialog = $state(false);
  let footnoteContent = $state('');

  $effect(() => {
    titleValue = chapter.title;
  });

  function commitTitle() {
    editingTitle = false;
    if (titleValue.trim()) {
      onTitleChange(titleValue.trim());
    }
  }

  function handleImageInsert(image: { src: string; alt: string; width: string; align: string; caption?: string }) {
    const captionHtml = image.caption
      ? `<div class="image-caption">${image.caption}</div>`
      : '';
    const imgHtml = `<div class="image-container align-${image.align}"><img src="${image.src}" alt="${image.alt}" style="width: ${image.width};" />${captionHtml}</div>`;
    onContentChange(chapter.content + imgHtml);
    showImageUploader = false;
  }

  function handleAddFootnote() {
    const num = getNextFootnoteNumber(chapter.content);
    const marker = `<sup data-footnote="${num}" class="footnote-marker">[${num}]</sup>`;
    const definition = `<div data-footnote-content="${num}" class="footnote-definition">[${num}] ${footnoteContent}</div>`;
    onContentChange(chapter.content + marker + definition);
    footnoteContent = '';
    showFootnoteDialog = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    // Ctrl+Shift+F for footnote
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      showFootnoteDialog = true;
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="flex-1 flex flex-col min-w-0 overflow-hidden">
  <!-- Chapter title -->
  <div class="px-6 py-4 border-b border-[var(--ui-border)] bg-[var(--ui-card)]">
    <div class="flex items-center justify-between">
      {#if editingTitle}
        <input
          type="text"
          bind:value={titleValue}
          onblur={commitTitle}
          onkeydown={(e) => e.key === 'Enter' && commitTitle()}
          class="flex-1 text-2xl font-bold text-[var(--ui-foreground)] bg-transparent border-none outline-none"
          autofocus
        />
      {:else}
        <button
          onclick={() => editingTitle = true}
          class="group flex items-center gap-2 text-2xl font-bold text-[var(--ui-foreground)] hover:text-[var(--ui-primary)] cursor-pointer"
        >
          {chapter.title}
          <Pencil class="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      {/if}

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" onclick={() => showImageUploader = true} class="h-8 text-xs">
          <Image class="size-3.5 mr-1" /> Image
        </Button>
        <Button variant="outline" size="sm" onclick={() => showFootnoteDialog = true} class="h-8 text-xs">
          <Hash class="size-3.5 mr-1" /> Footnote
        </Button>
      </div>
    </div>
  </div>

  <!-- Editor -->
  <div class="flex-1 overflow-auto p-6 bg-white">
    <div class="max-w-2xl mx-auto">
      <RichTextEditor
        content={chapter.content}
        placeholder="Start writing your chapter... (Ctrl+Shift+F for footnote)"
        height={600}
        onUpdate={onContentChange}
      />
    </div>
  </div>
</div>

<!-- Image Uploader -->
{#if showImageUploader}
  <ImageUploader
    onInsert={handleImageInsert}
    onClose={() => showImageUploader = false}
  />
{/if}

<!-- Footnote Dialog -->
{#if showFootnoteDialog}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-[var(--ui-card)] rounded-xl p-6 w-96 shadow-xl">
      <h3 class="text-lg font-semibold mb-4">Add Footnote</h3>
      <p class="text-sm text-[var(--ui-muted-foreground)] mb-3">
        A footnote marker [{getNextFootnoteNumber(chapter.content)}] will be added at the end of your content.
      </p>
      <textarea
        bind:value={footnoteContent}
        placeholder="Footnote content..."
        class="w-full h-24 px-3 py-2 rounded-lg border border-[var(--ui-input)] text-sm resize-none"
      ></textarea>
      <div class="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" onclick={() => showFootnoteDialog = false}>Cancel</Button>
        <Button size="sm" onclick={handleAddFootnote} disabled={!footnoteContent.trim()}>Add</Button>
      </div>
    </div>
  </div>
{/if}

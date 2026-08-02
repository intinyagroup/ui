<script lang="ts">
  import { Pencil } from 'lucide-svelte';
  import { RichTextEditor } from '@intinyagroup/rich-text';
  import type { Chapter } from '../book-model.js';

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

  $effect(() => {
    titleValue = chapter.title;
  });

  function commitTitle() {
    editingTitle = false;
    if (titleValue.trim()) {
      onTitleChange(titleValue.trim());
    }
  }
</script>

<div class="flex-1 flex flex-col min-w-0 overflow-hidden">
  <!-- Chapter title -->
  <div class="px-6 py-4 border-b border-[var(--ui-border)] bg-[var(--ui-card)]">
    {#if editingTitle}
      <input
        type="text"
        bind:value={titleValue}
        onblur={commitTitle}
        onkeydown={(e) => e.key === 'Enter' && commitTitle()}
        class="w-full text-2xl font-bold text-[var(--ui-foreground)] bg-transparent border-none outline-none"
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
  </div>

  <!-- Editor -->
  <div class="flex-1 overflow-auto p-6 bg-white">
    <div class="max-w-2xl mx-auto">
      <RichTextEditor
        content={chapter.content}
        placeholder="Start writing your chapter..."
        height={600}
        onUpdate={onContentChange}
      />
    </div>
  </div>
</div>

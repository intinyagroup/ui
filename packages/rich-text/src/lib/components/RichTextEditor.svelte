<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Placeholder from '@tiptap/extension-placeholder';
  import Underline from '@tiptap/extension-underline';
  import TextAlign from '@tiptap/extension-text-align';
  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';
  import Highlight from '@tiptap/extension-highlight';
  import Table from '@tiptap/extension-table';
  import TableRow from '@tiptap/extension-table-row';
  import TableCell from '@tiptap/extension-table-cell';
  import TableHeader from '@tiptap/extension-table-header';
  import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Code, Minus, Link as LinkIcon, Image as ImageIcon,
    Undo, Redo, Heading1, Heading2, Heading3, TableIcon, Plus, Trash2,
  } from 'lucide-svelte';
  import { Button, Separator } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    content = '',
    placeholder = 'Start writing...',
    editable = true,
    height = 300,
    class: className,
    onUpdate,
  }: {
    content?: string;
    placeholder?: string;
    editable?: boolean;
    height?: number;
    class?: string;
    onUpdate?: (html: string) => void;
  } = $props();

  let editorEl: HTMLDivElement | null = null;
  let editor: Editor | null = null;
  let isActive = $state<Record<string, boolean>>({});

  onMount(() => {
    if (!editorEl) return;

    editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder }),
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Link.configure({ openOnClick: false }),
        Image,
        Highlight.configure({ multicolor: true }),
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,
      ],
      content,
      editable,
      onUpdate: ({ editor: e }) => {
        const html = e.getHTML();
        isActive = getActiveStates(e);
        onUpdate?.(html);
      },
      onSelectionUpdate: ({ editor: e }) => {
        isActive = getActiveStates(e);
      },
    });
  });

  onDestroy(() => {
    if (editor) editor.destroy();
  });

  function getActiveStates(e: Editor): Record<string, boolean> {
    return {
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h1: e.isActive('heading', { level: 1 }),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bulletList: e.isActive('bulletList'),
      orderedList: e.isActive('orderedList'),
      blockquote: e.isActive('blockquote'),
      codeBlock: e.isActive('codeBlock'),
      alignLeft: e.isActive({ textAlign: 'left' }),
      alignCenter: e.isActive({ textAlign: 'center' }),
      alignRight: e.isActive({ textAlign: 'right' }),
      alignJustify: e.isActive({ textAlign: 'justify' }),
      link: e.isActive('link'),
    };
  }

  function toggleBold() { editor?.chain().focus().toggleBold().run(); }
  function toggleItalic() { editor?.chain().focus().toggleItalic().run(); }
  function toggleUnderline() { editor?.chain().focus().toggleUnderline().run(); }
  function toggleStrike() { editor?.chain().focus().toggleStrike().run(); }
  function setHeading(level: 1 | 2 | 3) { editor?.chain().focus().toggleHeading({ level }).run(); }
  function toggleBulletList() { editor?.chain().focus().toggleBulletList().run(); }
  function toggleOrderedList() { editor?.chain().focus().toggleOrderedList().run(); }
  function toggleBlockquote() { editor?.chain().focus().toggleBlockquote().run(); }
  function toggleCodeBlock() { editor?.chain().focus().toggleCodeBlock().run(); }
  function setAlign(align: 'left' | 'center' | 'right' | 'justify') { editor?.chain().focus().setTextAlign(align).run(); }
  function setLink() {
    const url = window.prompt('Enter URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }
  function setImage() {
    const url = window.prompt('Enter image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }
  function insertHorizontalRule() { editor?.chain().focus().setHorizontalRule().run(); }
  function insertTable() { editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); }
  function toggleHighlight(color?: string) {
    if (color) {
      editor?.chain().focus().toggleHighlight({ color }).run();
    } else {
      editor?.chain().focus().toggleHighlight().run();
    }
  }
  function addColumnBefore() { editor?.chain().focus().addColumnBefore().run(); }
  function addColumnAfter() { editor?.chain().focus().addColumnAfter().run(); }
  function deleteColumn() { editor?.chain().focus().deleteColumn().run(); }
  function addRowBefore() { editor?.chain().focus().addRowBefore().run(); }
  function addRowAfter() { editor?.chain().focus().addRowAfter().run(); }
  function deleteRow() { editor?.chain().focus().deleteRow().run(); }
  function deleteTable() { editor?.chain().focus().deleteTable().run(); }
  function undo() { editor?.chain().focus().undo().run(); }
  function redo() { editor?.chain().focus().redo().run(); }
</script>

<div class={cn('rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] overflow-hidden', className)}>
  <!-- Toolbar -->
  {#if editable}
    <div class="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/30">
      <Button variant="ghost" size="sm" class="size-8 p-0" onclick={undo}>
        <Undo class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class="size-8 p-0" onclick={redo}>
        <Redo class="size-4" />
      </Button>

      <Separator orientation="vertical" class="h-6 mx-1" />

      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.h1 && "bg-[var(--ui-primary)]/10")} onclick={() => setHeading(1)}>
        <Heading1 class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.h2 && "bg-[var(--ui-primary)]/10")} onclick={() => setHeading(2)}>
        <Heading2 class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.h3 && "bg-[var(--ui-primary)]/10")} onclick={() => setHeading(3)}>
        <Heading3 class="size-4" />
      </Button>

      <Separator orientation="vertical" class="h-6 mx-1" />

      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.bold && "bg-[var(--ui-primary)]/10")} onclick={toggleBold}>
        <Bold class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.italic && "bg-[var(--ui-primary)]/10")} onclick={toggleItalic}>
        <Italic class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.underline && "bg-[var(--ui-primary)]/10")} onclick={toggleUnderline}>
        <UnderlineIcon class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.strike && "bg-[var(--ui-primary)]/10")} onclick={toggleStrike}>
        <Strikethrough class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.highlight && "bg-[var(--ui-primary)]/10")} onclick={() => toggleHighlight('#fef08a')}>
        <Highlighter class="size-4" />
      </Button>

      <Separator orientation="vertical" class="h-6 mx-1" />

      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.bulletList && "bg-[var(--ui-primary)]/10")} onclick={toggleBulletList}>
        <List class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.orderedList && "bg-[var(--ui-primary)]/10")} onclick={toggleOrderedList}>
        <ListOrdered class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.blockquote && "bg-[var(--ui-primary)]/10")} onclick={toggleBlockquote}>
        <Quote class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.codeBlock && "bg-[var(--ui-primary)]/10")} onclick={toggleCodeBlock}>
        <Code class="size-4" />
      </Button>

      <Separator orientation="vertical" class="h-6 mx-1" />

      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.alignLeft && "bg-[var(--ui-primary)]/10")} onclick={() => setAlign('left')}>
        <AlignLeft class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.alignCenter && "bg-[var(--ui-primary)]/10")} onclick={() => setAlign('center')}>
        <AlignCenter class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.alignRight && "bg-[var(--ui-primary)]/10")} onclick={() => setAlign('right')}>
        <AlignRight class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.alignJustify && "bg-[var(--ui-primary)]/10")} onclick={() => setAlign('justify')}>
        <AlignJustify class="size-4" />
      </Button>

      <Separator orientation="vertical" class="h-6 mx-1" />

      <Button variant="ghost" size="sm" class={cn("size-8 p-0", isActive.link && "bg-[var(--ui-primary)]/10")} onclick={setLink}>
        <LinkIcon class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class="size-8 p-0" onclick={setImage}>
        <ImageIcon class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class="size-8 p-0" onclick={insertTable}>
        <TableIcon class="size-4" />
      </Button>
      <Button variant="ghost" size="sm" class="size-8 p-0" onclick={insertHorizontalRule}>
        <Minus class="size-4" />
      </Button>
    </div>
  {/if}

  <!-- Editor -->
  <div
    bind:this={editorEl}
    class="prose prose-sm max-w-none p-4 focus:outline-none"
    style="min-height: {height}px;"
  ></div>
</div>

<style>
  :global(.tiptap) {
    outline: none;
  }
  :global(.tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: var(--ui-muted-foreground);
    pointer-events: none;
    height: 0;
  }
  :global(.tiptap h1) { font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0; }
  :global(.tiptap h2) { font-size: 1.25rem; font-weight: 600; margin: 0.5rem 0; }
  :global(.tiptap h3) { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; }
  :global(.tiptap ul) { list-style-type: disc; padding-left: 1.5rem; }
  :global(.tiptap ol) { list-style-type: decimal; padding-left: 1.5rem; }
  :global(.tiptap blockquote) {
    border-left: 3px solid var(--ui-primary);
    padding-left: 1rem;
    margin-left: 0;
    color: var(--ui-muted-foreground);
  }
  :global(.tiptap pre) {
    background: var(--ui-secondary);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-family: monospace;
    font-size: 0.875rem;
  }
  :global(.tiptap code) {
    background: var(--ui-secondary);
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    font-size: 0.875em;
  }
  :global(.tiptap pre code) {
    background: none;
    padding: 0;
  }
  :global(.tiptap img) {
    max-width: 100%;
    border-radius: 0.5rem;
  }
  :global(.tiptap hr) {
    border: none;
    border-top: 1px solid var(--ui-border);
    margin: 1rem 0;
  }
  :global(.tiptap table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    overflow: hidden;
  }
  :global(.tiptap th),
  :global(.tiptap td) {
    border: 1px solid var(--ui-border);
    padding: 0.5rem 0.75rem;
    text-align: left;
    position: relative;
    min-width: 80px;
  }
  :global(.tiptap th) {
    background: var(--ui-secondary);
    font-weight: 600;
  }
  :global(.tiptap td.selectedCell) {
    background: var(--ui-primary) / 10;
  }
  :global(.tiptap .selectedCell::after) {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }
  :global(.tiptap .column-resize-handle) {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--ui-primary);
    cursor: col-resize;
  }
  :global(.tiptap .image-container) {
    margin: 1.5em 0;
    text-align: center;
  }
  :global(.tiptap .image-container.align-left) { text-align: left; }
  :global(.tiptap .image-container.align-center) { text-align: center; }
  :global(.tiptap .image-container.align-right) { text-align: right; }
  :global(.tiptap .image-container.align-full img) { width: 100%; }
  :global(.tiptap .image-caption) {
    font-size: 0.85em;
    color: var(--ui-muted-foreground);
    margin-top: 0.5em;
    font-style: italic;
  }
  :global(.tiptap .footnote-marker) {
    color: var(--ui-primary);
    cursor: pointer;
    font-size: 0.8em;
  }
  :global(.tiptap .footnote-definition) {
    font-size: 0.9em;
    color: var(--ui-muted-foreground);
    border-top: 1px solid var(--ui-border);
    padding-top: 0.5em;
    margin-top: 1em;
  }
  :global(.tiptap mark) {
    background-color: #fef08a;
    padding: 0.1em 0.2em;
    border-radius: 2px;
  }
  :global(.tiptap .cross-ref) {
    color: var(--ui-primary);
    cursor: pointer;
    text-decoration: underline;
    text-decoration-style: dotted;
  }
</style>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor, Node, mergeAttributes } from '@tiptap/core';
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
  import Typography from '@tiptap/extension-typography';
  import BubbleMenu from '@tiptap/extension-bubble-menu';
  import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Code, Minus, Link as LinkIcon, Image as ImageIcon,
    Undo, Redo, Heading1, Heading2, Heading3, TableIcon, Plus, Trash2,
    Video,
  } from 'lucide-svelte';
  import { Button, Separator } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    content = '',
    placeholder = 'Start writing...',
    editable = true,
    height = 400,
    class: className,
    onUpdate,
    onImageUpload,
  }: {
    content?: string;
    placeholder?: string;
    editable?: boolean;
    height?: number;
    class?: string;
    onUpdate?: (html: string) => void;
    /** Called when paste/drop provides an image file. Return a URL to insert. */
    onImageUpload?: (file: File) => Promise<string>;
  } = $props();

  let editorEl: HTMLDivElement | null = null;
  let bubbleMenuEl: HTMLDivElement | null = null;
  let editor: Editor | null = null;
  let isActive = $state<Record<string, boolean>>({});
  let uploadingCount = $state(0);

  // ---------------------------------------------------------------------------
  // Custom Extensions
  // ---------------------------------------------------------------------------

  /** Image with href/alt/title attributes — renders as <a><img></a> when href set */
  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        href: { default: null },
        alt: { default: '' },
        title: { default: '' },
        target: { default: '_blank' },
      };
    },
    renderHTML({ HTMLAttributes }) {
      const { href, target, alt, title, ...rest } = HTMLAttributes;
      const img = ['img', mergeAttributes(this.options.HTMLAttributes, rest, { alt, title })];
      if (href) {
        return ['a', { href, target, class: 'image-link' }, img];
      }
      return img;
    },
  });

  /** YouTube iframe embed node */
  const CustomYoutube = Node.create({
    name: 'youtube',
    group: 'block',
    atom: true,
    addAttributes() {
      return { src: { default: null } };
    },
    parseHTML() {
      return [
        { tag: "iframe[src*='youtube.com']" },
        { tag: "iframe[src*='youtu.be']" },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        { class: 'video-wrapper' },
        [
          'iframe',
          mergeAttributes(HTMLAttributes, {
            width: '100%',
            height: '315',
            allowfullscreen: 'true',
          }),
        ],
      ];
    },
  });

  // ---------------------------------------------------------------------------
  // Image Compression
  // ---------------------------------------------------------------------------

  async function compressImage(file: File): Promise<File> {
    if (file.size < 100 * 1024) return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          let { width, height } = img;
          const maxDim = 2048;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (height / width) * maxDim;
              width = maxDim;
            } else {
              width = (width / height) * maxDim;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // ---------------------------------------------------------------------------
  // Image Upload (paste / drop)
  // ---------------------------------------------------------------------------

  async function uploadAndInsertImage(file: File) {
    if (!editor) return;
    uploadingCount++;
    try {
      let src: string;
      if (onImageUpload) {
        const compressed = await compressImage(file);
        src = await onImageUpload(compressed);
      } else {
        // Fallback: inline data URL (no server upload)
        src = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      editor.chain().focus().setImage({ src }).run();
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      uploadingCount--;
    }
  }

  async function handleFiles(files: File[]) {
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    await Promise.all(images.map(uploadAndInsertImage));
  }

  // ---------------------------------------------------------------------------
  // YouTube Embed
  // ---------------------------------------------------------------------------

  function addYoutube() {
    const url = window.prompt('Enter YouTube URL:');
    if (!url || !editor) return;
    const match = url.match(
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
    );
    const id = match && match[2].length === 11 ? match[2] : null;
    if (id) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'youtube',
          attrs: { src: `https://www.youtube.com/embed/${id}` },
        })
        .run();
    }
  }

  // ---------------------------------------------------------------------------
  // Toolbar Helpers
  // ---------------------------------------------------------------------------

  function getActiveStates(e: Editor): Record<string, boolean> {
    return {
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      highlight: e.isActive('highlight'),
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
  function setAlign(align: 'left' | 'center' | 'right' | 'justify') {
    editor?.chain().focus().setTextAlign(align).run();
  }
  function setLink() {
    const url = window.prompt('Enter URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }
  function setImage() {
    const url = window.prompt('Enter image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }
  function insertHorizontalRule() { editor?.chain().focus().setHorizontalRule().run(); }
  function insertTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }
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

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

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
        CustomImage.configure({
          inline: false,
          HTMLAttributes: {
            class: 'rounded-lg mx-auto block max-w-full h-auto cursor-pointer',
          },
        }),
        Highlight.configure({ multicolor: true }),
        Typography,
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,
        BubbleMenu.configure({
          element: bubbleMenuEl!,
          pluginKey: 'bubbleMenu',
          shouldShow: ({ editor: e }) =>
            e.isEditable &&
            !e.isActive('table') &&
            e.view.state.selection.content().size > 0,
        }),
        CustomYoutube,
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
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none focus:outline-none',
        },
        handleDOMEvents: {
          paste: (_view, event) => {
            const items = event.clipboardData?.items;
            if (!items) return false;
            const imageFiles: File[] = [];
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                if (file) imageFiles.push(file);
              }
            }
            if (imageFiles.length) {
              event.preventDefault();
              handleFiles(imageFiles);
              return true;
            }
            return false;
          },
          drop: (_view, event) => {
            const files = event.dataTransfer?.files;
            if (!files?.length) return false;
            const imageFiles = Array.from(files).filter((f) =>
              f.type.startsWith('image/')
            );
            if (imageFiles.length) {
              event.preventDefault();
              handleFiles(imageFiles);
              return true;
            }
            return false;
          },
        },
      },
    });
  });

  onDestroy(() => {
    if (editor) editor.destroy();
  });
</script>

<div
  class={cn(
    'rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-xs overflow-hidden transition-colors',
    className
  )}
>
  <!-- Toolbar -->
  {#if editable}
    <div
      class="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/25 backdrop-blur-xs"
    >
      <div class="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          class="size-7.5 p-0 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]"
          onclick={undo}
          title="Undo (Ctrl+Z)"
        >
          <Undo class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="size-7.5 p-0 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]"
          onclick={redo}
          title="Redo (Ctrl+Y)"
        >
          <Redo class="size-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" class="h-4 mx-1.5 opacity-60" />

      <div class="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.h1
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => setHeading(1)}
          title="Heading 1"
        >
          <Heading1 class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.h2
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => setHeading(2)}
          title="Heading 2"
        >
          <Heading2 class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.h3
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => setHeading(3)}
          title="Heading 3"
        >
          <Heading3 class="size-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" class="h-4 mx-1.5 opacity-60" />

      <div class="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.bold
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleBold}
          title="Bold (Ctrl+B)"
        >
          <Bold class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.italic
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleItalic}
          title="Italic (Ctrl+I)"
        >
          <Italic class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.underline
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleUnderline}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.strike
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleStrike}
          title="Strikethrough"
        >
          <Strikethrough class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.highlight
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => toggleHighlight('#fef08a')}
          title="Highlight text"
        >
          <Highlighter class="size-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" class="h-4 mx-1.5 opacity-60" />
      <div class="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.bulletList
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleBulletList}
          title="Bullet list"
        >
          <List class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.orderedList
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleOrderedList}
          title="Numbered list"
        >
          <ListOrdered class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.blockquote
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleBlockquote}
          title="Quote"
        >
          <Quote class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.codeBlock
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={toggleCodeBlock}
          title="Code block"
        >
          <Code class="size-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" class="h-4 mx-1.5 opacity-60" />

      <div class="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.alignLeft
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => setAlign('left')}
          title="Align left"
        >
          <AlignLeft class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.alignCenter
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => setAlign('center')}
          title="Align center"
        >
          <AlignCenter class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.alignRight
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => setAlign('right')}
          title="Align right"
        >
          <AlignRight class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.alignJustify
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={() => setAlign('justify')}
          title="Align justify"
        >
          <AlignJustify class="size-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" class="h-4 mx-1.5 opacity-60" />

      <div class="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            'size-7.5 p-0 rounded-md transition-colors',
            isActive.link
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
          )}
          onclick={setLink}
          title="Insert link"
        >
          <LinkIcon class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="size-7.5 p-0 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]"
          onclick={setImage}
          title="Insert image"
        >
          <ImageIcon class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="size-7.5 p-0 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]"
          onclick={insertTable}
          title="Insert table"
        >
          <TableIcon class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="size-7.5 p-0 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]"
          onclick={addYoutube}
          title="Embed YouTube video"
        >
          <Video class="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="size-7.5 p-0 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]"
          onclick={insertHorizontalRule}
          title="Divider line"
        >
          <Minus class="size-3.5" />
        </Button>
      </div>
      {#if uploadingCount > 0}
        <span class="ml-auto text-xs text-[var(--ui-muted-foreground)] font-medium">
          Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...
        </span>
      {/if}
    </div>
  {/if}

  <!-- Editor -->
  <div
    bind:this={editorEl}
    class="prose prose-sm max-w-none p-4 focus:outline-none"
    style="min-height: {height}px;"
  ></div>

  <!-- BubbleMenu: floating toolbar on text selection (element bound for TipTap) -->
  <div
    bind:this={bubbleMenuEl}
    class="flex items-center gap-1 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)]/90 px-1.5 py-1 shadow-xl backdrop-blur-md animate-in fade-in-50 zoom-in-95"
  >
    {#if editor}
      <Button
        variant="ghost"
        size="sm"
        class={cn(
          'size-7 p-0 rounded-md transition-colors',
          editor.isActive('bold')
            ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
            : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
        )}
        onclick={toggleBold}
      >
        <Bold class="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class={cn(
          'size-7 p-0 rounded-md transition-colors',
          editor.isActive('italic')
            ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
            : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
        )}
        onclick={toggleItalic}
      >
        <Italic class="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class={cn(
          'size-7 p-0 rounded-md transition-colors',
          editor.isActive('underline')
            ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
            : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
        )}
        onclick={toggleUnderline}
      >
        <UnderlineIcon class="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class={cn(
          'size-7 p-0 rounded-md transition-colors',
          editor.isActive('strike')
            ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
            : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
        )}
        onclick={toggleStrike}
      >
        <Strikethrough class="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class={cn(
          'size-7 p-0 rounded-md transition-colors',
          editor.isActive('highlight')
            ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
            : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
        )}
        onclick={() => toggleHighlight('#fef08a')}
      >
        <Highlighter class="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class={cn(
          'size-7 p-0 rounded-md transition-colors',
          editor.isActive('link')
            ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
            : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
        )}
        onclick={setLink}
      >
        <LinkIcon class="size-3.5" />
      </Button>
    {/if}
  </div>
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
  :global(.tiptap h1) {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }
  :global(.tiptap h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }
  :global(.tiptap h3) {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }
  :global(.tiptap ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
  :global(.tiptap ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
  }
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
  :global(.tiptap a.image-link) {
    display: block;
    text-align: center;
  }
  :global(.tiptap a.image-link img) {
    display: block;
    margin: 0 auto;
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
    background: color-mix(in srgb, var(--ui-primary) 10%, transparent);
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

  /* YouTube / Video embed */
  :global(.tiptap .video-wrapper) {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    margin: 1.5rem 0;
    border-radius: 0.75rem;
    background: var(--ui-secondary);
  }
  :global(.tiptap .video-wrapper iframe) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  /* Typography smart-quotes styling (cosmetic, TipTap handles conversion) */
  :global(.tiptap mark) {
    background-color: #fef08a;
    padding: 0.1em 0.2em;
    border-radius: 2px;
  }
</style>

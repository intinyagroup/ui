<script lang="ts">
  import { Trash2, MessageSquare, Highlighter, Pencil, StickyNote } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { Annotation } from '../pdf-core.js';

  let {
    annotations,
    currentPage,
    selectedAnnotationId,
    onSelectAnnotation,
    onDeleteAnnotation,
    onCommentAdd,
    showSidebar,
  }: {
    annotations: Annotation[];
    currentPage: number;
    selectedAnnotationId?: string;
    onSelectAnnotation: (annotation: Annotation) => void;
    onDeleteAnnotation: (id: string) => void;
    onCommentAdd: (annotationId: string, text: string) => void;
    showSidebar: boolean;
  } = $props();

  const typeIcons: Record<string, any> = {
    highlight: Highlighter,
    underline: Highlighter,
    strikethrough: Highlighter,
    freehand: Pencil,
    text: null,
    note: StickyNote,
    rectangle: null,
    ellipse: null,
  };

  const typeLabels: Record<string, string> = {
    highlight: 'Highlight',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    freehand: 'Drawing',
    text: 'Text',
    note: 'Note',
    rectangle: 'Rectangle',
    ellipse: 'Ellipse',
  };

  let commentInput = $state('');

  function addComment(annotationId: string) {
    if (commentInput.trim()) {
      onCommentAdd(annotationId, commentInput.trim());
      commentInput = '';
    }
  }

  $: sortedAnnotations = [...annotations].sort((a, b) => a.pageNumber - b.pageNumber);
</script>

{#if showSidebar}
  <div class="w-72 border-l border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col shrink-0">
    <div class="px-3 py-2.5 border-b border-[var(--ui-border)]">
      <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Annotations</h3>
      <p class="text-xs text-[var(--ui-muted-foreground)] mt-0.5">{annotations.length} annotation(s)</p>
    </div>

    <div class="flex-1 overflow-auto p-2 space-y-2">
      {#if sortedAnnotations.length === 0}
        <div class="text-center py-8 text-sm text-[var(--ui-muted-foreground)]">
          No annotations yet. Use the toolbar to add highlights, notes, or drawings.
        </div>
      {:else}
        {#each sortedAnnotations as annotation (annotation.id)}
          {@const Icon = typeIcons[annotation.type]}
          {@const isSelected = annotation.id === selectedAnnotationId}

          <button
            onclick={() => onSelectAnnotation(annotation)}
            class={cn(
              'w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer',
              isSelected
                ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/5'
                : 'border-[var(--ui-border)] hover:bg-[var(--ui-secondary)]/50'
            )}
          >
            <div class="flex items-start gap-2">
              {#if Icon}
                <Icon class="size-4 mt-0.5 text-[var(--ui-muted-foreground)]" />
              {/if}
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-[var(--ui-foreground)]">
                    {typeLabels[annotation.type]}
                  </span>
                  <span class="text-xs text-[var(--ui-muted-foreground)]">
                    p.{annotation.pageNumber}
                  </span>
                </div>
                {#if annotation.text}
                  <p class="text-xs text-[var(--ui-muted-foreground)] mt-1 line-clamp-2">
                    {annotation.text}
                  </p>
                {/if}
                <div class="flex items-center gap-1 mt-1.5">
                  <div
                    class="size-3 rounded-full border border-[var(--ui-border)]"
                    style="background-color: {annotation.color}"
                  ></div>
                  <span class="text-[10px] text-[var(--ui-muted-foreground)]">
                    {annotation.author ?? 'You'}
                  </span>
                </div>
              </div>
              <button
                onclick={(e) => { e.stopPropagation(); onDeleteAnnotation(annotation.id); }}
                class="p-1 rounded text-[var(--ui-muted-foreground)] hover:text-[var(--ui-destructive)] hover:bg-[var(--ui-destructive)]/10"
              >
                <Trash2 class="size-3.5" />
              </button>
            </div>
          </button>
        {/each}
      {/if}
    </div>
  </div>
{/if}

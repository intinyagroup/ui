<script lang="ts">
  import { X, Download, Calendar, HardDrive, Tag } from "lucide-svelte";
  import FileIcon from "./FileIcon.svelte";
  import {
    formatFileSize,
    getFileCategory,
    type FileItem,
  } from "../file-model.js";

  let {
    item,
    onClose,
    onDownload,
  }: {
    item: FileItem | null;
    onClose: () => void;
    onDownload?: (item: FileItem) => void;
  } = $props();

  const category = $derived(item ? getFileCategory(item) : "other");
</script>

{#if item}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
    onclick={onClose}
  >
    <!-- Modal Dialog Box -->
    <div
      class="relative flex flex-col w-full max-w-xl max-h-[85vh] rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-xl overflow-hidden text-[var(--ui-foreground)]"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--ui-border)]/60 bg-[var(--ui-background)]"
      >
        <div class="flex items-center gap-2 min-w-0">
          <FileIcon
            type={item.type}
            name={item.name}
            mimeType={item.mimeType}
            class="size-5 shrink-0"
          />
          <h3 class="text-sm font-semibold truncate" title={item.name}>
            {item.name}
          </h3>
        </div>

        <div class="flex items-center gap-1.5">
          {#if onDownload && item.type === "file" && item.permissions?.download !== false}
            <button
              type="button"
              class="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-[var(--ui-border)] text-xs font-medium hover:bg-[var(--ui-muted)] transition-colors"
              onclick={() => onDownload(item)}
              aria-label="Download file"
            >
              <Download class="size-3.5" />
              <span>Download</span>
            </button>
          {/if}

          <button
            type="button"
            class="p-1.5 rounded-lg text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)] transition-colors"
            onclick={onClose}
            aria-label="Close preview"
          >
            <X class="size-4" />
          </button>
        </div>
      </div>

      <!-- Preview Content Body -->
      <div
        class="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center min-h-[220px] bg-[var(--ui-background)]/50"
      >
        {#if category === "image" && (item.url || item.thumbnail)}
          <img
            src={item.url || item.thumbnail}
            alt={item.name}
            class="max-h-80 max-w-full rounded-lg object-contain shadow-xs border border-[var(--ui-border)]/50"
          />
        {:else if category === "audio" && item.url}
          <audio controls class="w-full max-w-md my-4">
            <source src={item.url} type={item.mimeType} />
            Your browser does not support audio playback.
          </audio>
        {:else if category === "video" && item.url}
          <video
            controls
            class="max-h-72 w-full max-w-md rounded-lg shadow-xs my-2"
          >
            <source src={item.url} type={item.mimeType} />
            Your browser does not support video playback.
          </video>
        {:else}
          <div
            class="flex flex-col items-center justify-center py-8 text-[var(--ui-muted-foreground)] gap-2"
          >
            <FileIcon
              type={item.type}
              name={item.name}
              mimeType={item.mimeType}
              class="size-16"
            />
            <p class="text-xs">Preview not available for this file type</p>
          </div>
        {/if}
      </div>

      <!-- Metadata Details Footer -->
      <div
        class="grid grid-cols-3 gap-2 px-4 py-3 bg-[var(--ui-muted)]/30 border-t border-[var(--ui-border)]/60 text-xs"
      >
        <div>
          <span
            class="text-[10px] uppercase text-[var(--ui-muted-foreground)] font-semibold block"
            >Type</span
          >
          <span class="font-medium text-[var(--ui-foreground)] truncate"
            >{item.type === "folder"
              ? "Folder"
              : item.extension
                ? item.extension.toUpperCase()
                : "File"}</span
          >
        </div>
        <div>
          <span
            class="text-[10px] uppercase text-[var(--ui-muted-foreground)] font-semibold block"
            >Size</span
          >
          <span class="font-medium text-[var(--ui-foreground)]"
            >{formatFileSize(item.size)}</span
          >
        </div>
        <div>
          <span
            class="text-[10px] uppercase text-[var(--ui-muted-foreground)] font-semibold block"
            >Modified</span
          >
          <span class="font-medium text-[var(--ui-foreground)]"
            >{item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString()
              : "-"}</span
          >
        </div>
      </div>
    </div>
  </div>
{/if}

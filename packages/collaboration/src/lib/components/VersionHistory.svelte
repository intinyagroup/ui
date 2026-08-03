<script lang="ts">
  import { Clock, RotateCcw, Trash2, GitCompare, X, Plus, Save } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { versionHistory, type VersionEntry, type VersionDiff } from '../stores/version-history-store.js';
  import type { BookSettings } from '@intinyagroup/book-writer';

  let {
    settings,
    onRestore,
    onClose,
  }: {
    settings: BookSettings;
    onRestore: (settings: BookSettings) => void;
    onClose: () => void;
  } = $props();

  let showCreateDialog = $state(false);
  let showCompare = $state(false);
  let snapshotName = $state('');
  let snapshotDescription = $state('');
  let compareVersionA = $state('');
  let compareVersionB = $state('');
  let compareResult = $state<VersionDiff | null>(null);

  const allVersions = $derived($versionHistory.versions);

  function handleCreateSnapshot() {
    if (!snapshotName.trim()) return;
    versionHistory.createSnapshot(snapshotName.trim(), snapshotDescription.trim(), settings, 'User');
    snapshotName = '';
    snapshotDescription = '';
    showCreateDialog = false;
  }

  function handleRestore(versionId: string) {
    const restored = versionHistory.restoreVersion(versionId);
    if (restored) {
      onRestore(restored);
    }
  }

  function handleDelete(versionId: string) {
    versionHistory.deleteVersion(versionId);
  }

  function handleCompare() {
    if (!compareVersionA || !compareVersionB) return;
    compareResult = versionHistory.compareVersions(compareVersionA, compareVersionB);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-[var(--ui-card)] rounded-xl w-[640px] max-h-[80vh] shadow-xl flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--ui-border)]">
      <div class="flex items-center gap-2">
        <Clock class="size-5 text-[var(--ui-primary)]" />
        <h3 class="text-lg font-semibold text-[var(--ui-foreground)]">Version History</h3>
      </div>
      <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
        <X class="size-5" />
      </button>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 px-6 py-3 border-b border-[var(--ui-border)]">
      <Button size="sm" onclick={() => showCreateDialog = true}>
        <Plus class="size-3.5 mr-1" /> Save Snapshot
      </Button>
      <Button variant="outline" size="sm" onclick={() => showCompare = !showCompare}>
        <GitCompare class="size-3.5 mr-1" /> Compare
      </Button>
    </div>

    <!-- Compare mode -->
    {#if showCompare}
      <div class="px-6 py-4 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20">
        <div class="flex items-center gap-3">
          <select bind:value={compareVersionA} class="px-3 py-1.5 rounded-lg border border-[var(--ui-input)] text-sm">
            <option value="">Version A</option>
            {#each allVersions as v}
              <option value={v.id}>{v.name} ({formatTime(v.createdAt)})</option>
            {/each}
          </select>
          <span class="text-sm text-[var(--ui-muted-foreground)]">vs</span>
          <select bind:value={compareVersionB} class="px-3 py-1.5 rounded-lg border border-[var(--ui-input)] text-sm">
            <option value="">Version B</option>
            {#each allVersions as v}
              <option value={v.id}>{v.name} ({formatTime(v.createdAt)})</option>
            {/each}
          </select>
          <Button size="sm" onclick={handleCompare} disabled={!compareVersionA || !compareVersionB}>Compare</Button>
        </div>

        {#if compareResult}
          <div class="mt-3 grid grid-cols-3 gap-3 text-center">
            <div class="p-2 rounded bg-[var(--ui-card)]">
              <div class="text-lg font-bold text-[var(--ui-success)]">+{compareResult.chaptersAdded}</div>
              <div class="text-[10px] text-[var(--ui-muted-foreground)]">Added</div>
            </div>
            <div class="p-2 rounded bg-[var(--ui-card)]">
              <div class="text-lg font-bold text-[var(--ui-warning)]">~{compareResult.chaptersModified}</div>
              <div class="text-[10px] text-[var(--ui-muted-foreground)]">Modified</div>
            </div>
            <div class="p-2 rounded bg-[var(--ui-card)]">
              <div class="text-lg font-bold text-[var(--ui-destructive)]">-{compareResult.chaptersRemoved}</div>
              <div class="text-[10px] text-[var(--ui-muted-foreground)]">Removed</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-[var(--ui-muted-foreground)] text-center">
            {compareResult.wordsAdded.toLocaleString()} words added, {compareResult.wordsRemoved.toLocaleString()} words removed
          </div>
        {/if}
      </div>
    {/if}

    <!-- Version list -->
    <div class="flex-1 overflow-auto p-6 space-y-3">
      {#if allVersions.length === 0}
        <div class="text-center py-12 text-[var(--ui-muted-foreground)]">
          <Clock class="size-12 mx-auto mb-3 opacity-40" />
          <p class="text-sm">No versions saved yet</p>
          <p class="text-xs mt-1">Save a snapshot to track your progress</p>
        </div>
      {:else}
        {#each allVersions as version, index (version.id)}
          <div class="flex items-start gap-4 p-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] hover:shadow-sm transition-shadow">
            <!-- Timeline dot -->
            <div class="flex flex-col items-center shrink-0">
              <div class="size-3 rounded-full {version.autoSaved ? 'bg-[var(--ui-muted-foreground)]' : 'bg-[var(--ui-primary)]'}"></div>
              {#if index < allVersions.length - 1}
                <div class="w-px h-full bg-[var(--ui-border)] mt-1"></div>
              {/if}
            </div>

            <!-- Version info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold text-[var(--ui-foreground)]">{version.name}</span>
                {#if version.autoSaved}
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)]">auto-save</span>
                {/if}
              </div>
              {#if version.description}
                <p class="text-xs text-[var(--ui-muted-foreground)] mb-2">{version.description}</p>
              {/if}
              <div class="flex items-center gap-4 text-[10px] text-[var(--ui-muted-foreground)]">
                <span>{version.createdBy}</span>
                <span>{formatTime(version.createdAt)}</span>
                <span>{formatSize(version.size)}</span>
                <span>{version.settings.chapters.length} chapters</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" class="h-7 px-2" onclick={() => handleRestore(version.id)} title="Restore this version">
                <RotateCcw class="size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" class="h-7 px-2 text-[var(--ui-destructive)]" onclick={() => handleDelete(version.id)} title="Delete version">
                <Trash2 class="size-3.5" />
              </Button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<!-- Create Snapshot Dialog -->
{#if showCreateDialog}
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
    <div class="bg-[var(--ui-card)] rounded-xl p-6 w-96 shadow-xl">
      <h3 class="text-lg font-semibold mb-4">Save Version Snapshot</h3>
      <div class="space-y-3">
        <Input bind:value={snapshotName} placeholder="Version name (e.g., Draft 1)" />
        <Input bind:value={snapshotDescription} placeholder="Description (optional)" />
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button variant="outline" onclick={() => showCreateDialog = false}>Cancel</Button>
        <Button onclick={handleCreateSnapshot} disabled={!snapshotName.trim()}>
          <Save class="size-3.5 mr-1" /> Save
        </Button>
      </div>
    </div>
  </div>
{/if}

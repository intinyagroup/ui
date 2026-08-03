<script lang="ts">
  import { Users, MessageSquare, Clock, Plus, X, Send, Check, Reply } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { collaboration, type User, type Comment } from '../stores/collaboration-store.js';

  let {
    showPanel,
    onClose,
  }: {
    showPanel: boolean;
    onClose: () => void;
  } = $props();

  let activeTab = $state<'users' | 'comments' | 'versions'>('users');
  let newComment = $state('');
  let replyingTo = $state<string | null>(null);
  let replyContent = $state('');

  const state = $derived($collaboration);

  function handleAddComment() {
    if (!newComment.trim()) return;
    collaboration.addComment('current', newComment.trim(), 0);
    newComment = '';
  }

  function handleReply(commentId: string) {
    if (!replyContent.trim()) return;
    collaboration.replyToComment(commentId, replyContent.trim());
    replyContent = '';
    replyingTo = null;
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
</script>

{#if showPanel}
  <div class="fixed right-0 top-0 bottom-0 w-80 border-l border-[var(--ui-border)] bg-[var(--ui-card)] shadow-xl z-50 flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--ui-border)]">
      <div class="flex items-center gap-2">
        <div class="size-2.5 rounded-full {state.connected ? 'bg-[var(--ui-success)]' : 'bg-[var(--ui-destructive)]'}"></div>
        <span class="text-sm font-semibold text-[var(--ui-foreground)]">
          {state.connected ? 'Connected' : 'Offline'}
        </span>
      </div>
      <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
        <X class="size-4" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-[var(--ui-border)]">
      {#each [
        { id: 'users', label: 'Users', icon: Users, count: state.users.length },
        { id: 'comments', label: 'Comments', icon: MessageSquare, count: state.comments.length },
        { id: 'versions', label: 'History', icon: Clock, count: state.versions.length },
      ] as tab}
        <button
          onclick={() => activeTab = tab.id as typeof activeTab}
          class={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
            activeTab === tab.id
              ? "text-[var(--ui-primary)] border-b-2 border-[var(--ui-primary)]"
              : "text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]"
          )}
        >
          <tab.icon class="size-3.5" />
          {tab.label}
          {#if tab.count > 0}
            <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--ui-secondary)]">{tab.count}</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      {#if activeTab === 'users'}
        <!-- Online Users -->
        <div class="p-4 space-y-3">
          {#if state.users.length === 0}
            <div class="text-center py-8 text-sm text-[var(--ui-muted-foreground)]">
              No other users online
            </div>
          {:else}
            {#each state.users as user (user.id)}
              <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--ui-secondary)]/50">
                <div
                  class="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style="background-color: {user.color}"
                >
                  {getInitials(user.name)}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-[var(--ui-foreground)] truncate">{user.name}</div>
                  <div class="text-[10px] text-[var(--ui-muted-foreground)]">
                    Active {formatTime(user.lastSeen)}
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>

      {:else if activeTab === 'comments'}
        <!-- Comments -->
        <div class="p-4 space-y-4">
          <!-- Add comment -->
          <div class="flex gap-2">
            <Input
              bind:value={newComment}
              placeholder="Add a comment..."
              class="flex-1"
              onkeydown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button size="sm" onclick={handleAddComment} disabled={!newComment.trim()}>
              <Send class="size-3.5" />
            </Button>
          </div>

          <!-- Comments list -->
          {#each state.comments as comment (comment.id)}
            <div class="p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)]">
              <div class="flex items-center gap-2 mb-2">
                <div class="size-6 rounded-full bg-[var(--ui-primary)] flex items-center justify-center text-[10px] font-bold text-white">
                  {getInitials(comment.userId)}
                </div>
                <span class="text-xs font-medium text-[var(--ui-foreground)]">{comment.userId.slice(0, 8)}</span>
                <span class="text-[10px] text-[var(--ui-muted-foreground)]">{formatTime(comment.createdAt)}</span>
                {#if comment.resolved}
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ui-success)]/10 text-[var(--ui-success)]">Resolved</span>
                {/if}
              </div>
              <p class="text-sm text-[var(--ui-foreground)] mb-2">{comment.content}</p>

              <!-- Replies -->
              {#if comment.replies.length > 0}
                <div class="ml-6 space-y-2 border-l-2 border-[var(--ui-border)] pl-3">
                  {#each comment.replies as reply}
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-medium">{reply.userId.slice(0, 8)}</span>
                        <span class="text-[10px] text-[var(--ui-muted-foreground)]">{formatTime(reply.createdAt)}</span>
                      </div>
                      <p class="text-xs text-[var(--ui-muted-foreground)]">{reply.content}</p>
                    </div>
                  {/each}
                </div>
              {/if}

              <!-- Reply input -->
              {#if replyingTo === comment.id}
                <div class="mt-2 flex gap-2">
                  <Input bind:value={replyContent} placeholder="Reply..." class="flex-1 text-xs" />
                  <Button size="sm" onclick={() => handleReply(comment.id)} disabled={!replyContent.trim()}>
                    <Send class="size-3" />
                  </Button>
                </div>
              {:else}
                <button
                  onclick={() => replyingTo = comment.id}
                  class="mt-2 text-xs text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] cursor-pointer"
                >
                  <Reply class="size-3 inline mr-1" /> Reply
                </button>
              {/if}
            </div>
          {/each}

          {#if state.comments.length === 0}
            <div class="text-center py-8 text-sm text-[var(--ui-muted-foreground)]">
              No comments yet
            </div>
          {/if}
        </div>

      {:else if activeTab === 'versions'}
        <!-- Version History -->
        <div class="p-4 space-y-3">
          {#each state.versions as version (version.id)}
            <div class="p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)]">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-[var(--ui-foreground)]">{version.name}</span>
                {#if version.autoSaved}
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)]">auto</span>
                {/if}
              </div>
              {#if version.description}
                <p class="text-xs text-[var(--ui-muted-foreground)] mb-2">{version.description}</p>
              {/if}
              <div class="flex items-center justify-between text-[10px] text-[var(--ui-muted-foreground)]">
                <span>{version.createdBy} · {formatTime(version.createdAt)}</span>
                <span>{(version.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          {/each}

          {#if state.versions.length === 0}
            <div class="text-center py-8 text-sm text-[var(--ui-muted-foreground)]">
              No versions saved yet
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<script lang="ts">
  import { Lock, Unlock, Shield, AlertTriangle } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    isProtected,
    onProtect,
    onRemoveProtection,
  }: {
    isProtected: boolean;
    onProtect: (password: { user: string; owner: string; permissions: string[] }) => void;
    onRemoveProtection: (password: string) => void;
  } = $props();

  let showForm = $state(false);
  let userPassword = $state('');
  let ownerPassword = $state('');
  let confirmPassword = $state('');
  let permissions = $state({
    printing: true,
    copying: true,
    modifying: false,
    annotating: true,
  });
  let currentPassword = $state('');
  let error = $state('');

  function handleProtect() {
    error = '';

    if (!userPassword && !ownerPassword) {
      error = 'At least one password is required';
      return;
    }

    if (userPassword !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (userPassword.length < 4) {
      error = 'Password must be at least 4 characters';
      return;
    }

    const perms = Object.entries(permissions)
      .filter(([, v]) => v)
      .map(([k]) => k);

    onProtect({
      user: userPassword,
      owner: ownerPassword || userPassword,
      permissions: perms,
    });

    showForm = false;
    userPassword = '';
    ownerPassword = '';
    confirmPassword = '';
  }

  function handleRemove() {
    if (!currentPassword) {
      error = 'Enter current password to remove protection';
      return;
    }
    onRemoveProtection(currentPassword);
    currentPassword = '';
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2">
    {#if isProtected}
      <Lock class="size-5 text-[var(--ui-warning)]" />
      <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Password Protected</h3>
    {:else}
      <Unlock class="size-5 text-[var(--ui-muted-foreground)]" />
      <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Document Security</h3>
    {/if}
  </div>

  {#if isProtected}
    <div class="p-3 rounded-lg border border-[var(--ui-warning)]/30 bg-[var(--ui-warning)]/5">
      <div class="flex items-center gap-2 text-sm text-[var(--ui-warning)]">
        <Shield class="size-4" />
        This document is password protected
      </div>
    </div>

    <Button variant="outline" size="sm" class="w-full" onclick={() => showForm = !showForm}>
      <Unlock class="size-4 mr-2" />
      {showForm ? 'Cancel' : 'Remove Protection'}
    </Button>

    {#if showForm}
      <div class="space-y-3 p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/20">
        <Input bind:value={currentPassword} type="password" placeholder="Enter owner password" />
        <Button variant="destructive" size="sm" class="w-full" onclick={handleRemove}>
          Remove Protection
        </Button>
      </div>
    {/if}
  {:else}
    <Button size="sm" class="w-full" onclick={() => showForm = !showForm}>
      <Lock class="size-4 mr-2" />
      {showForm ? 'Cancel' : 'Add Password Protection'}
    </Button>

    {#if showForm}
      <div class="space-y-3 p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/20">
        <Input bind:value={userPassword} type="password" placeholder="User password (to open)" />
        <Input bind:value={ownerPassword} type="password" placeholder="Owner password (to change permissions)" />
        <Input bind:value={confirmPassword} type="password" placeholder="Confirm user password" />

        <div class="space-y-2">
          <span class="text-xs text-[var(--ui-muted-foreground)]">Permissions:</span>
          {#each Object.entries(permissions) as [key, value]}
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" bind:checked={permissions[key]} class="accent-[var(--ui-primary)]" />
              <span class="capitalize">{key}</span>
            </label>
          {/each}
        </div>

        {#if error}
          <div class="flex items-center gap-2 text-sm text-[var(--ui-destructive)]">
            <AlertTriangle class="size-4" />
            {error}
          </div>
        {/if}

        <Button size="sm" class="w-full" onclick={handleProtect}>
          <Lock class="size-4 mr-2" /> Apply Protection
        </Button>
      </div>
    {/if}
  {/if}
</div>

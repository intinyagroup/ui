<script lang="ts">
  import { Video, Sparkles } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { createComposition } from '@intinyagroup/motion';

  let {
    onCreateProject,
  }: {
    onCreateProject: (config: { name: string; width: number; height: number; fps: number }) => void;
  } = $props();

  const templates = [
    { name: 'YouTube Video', width: 1920, height: 1080, fps: 30, description: '16:9 landscape' },
    { name: 'Instagram Reel', width: 1080, height: 1920, fps: 30, description: '9:16 vertical' },
    { name: 'TikTok', width: 1080, height: 1920, fps: 30, description: '9:16 vertical' },
    { name: 'Twitter Post', width: 1200, height: 675, fps: 30, description: '16:9 landscape' },
    { name: 'Square Post', width: 1080, height: 1080, fps: 30, description: '1:1 square' },
    { name: 'Presentation', width: 1920, height: 1080, fps: 24, description: '16:9 cinematic' },
  ];
</script>

<div class="min-h-screen flex items-center justify-center bg-[var(--ui-muted)]/20 p-8">
  <div class="max-w-2xl w-full">
    <div class="text-center mb-8">
      <Sparkles class="size-12 mx-auto mb-4 text-[var(--ui-primary)]" />
      <h1 class="text-2xl font-bold text-[var(--ui-foreground)] mb-2">Create a New Project</h1>
      <p class="text-sm text-[var(--ui-muted-foreground)]">Choose a template to get started</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each templates as template}
        <button
          onclick={() => onCreateProject(template)}
          class="flex flex-col items-start p-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] hover:border-[var(--ui-primary)]/50 hover:shadow-md transition-all cursor-pointer text-left"
        >
          <div class="flex items-center gap-2 mb-2">
            <Video class="size-4 text-[var(--ui-primary)]" />
            <span class="text-sm font-semibold text-[var(--ui-foreground)]">{template.name}</span>
          </div>
          <span class="text-xs text-[var(--ui-muted-foreground)]">{template.description}</span>
          <span class="text-[10px] text-[var(--ui-muted-foreground)] mt-1">{template.width}×{template.height} @ {template.fps}fps</span>
        </button>
      {/each}
    </div>
  </div>
</div>

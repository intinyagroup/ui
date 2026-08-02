<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Check } from 'lucide-svelte';
  import { cn } from '../../utils.js';

  type StepStatus = 'completed' | 'current' | 'upcoming';

  let {
    steps,
    currentStep = $bindable(0),
    orientation = 'horizontal',
    class: className,
    onStepChange,
  }: {
    steps: { label: string; description?: string }[];
    currentStep?: number;
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    onStepChange?: (step: number) => void;
  } = $props();

  function getStepStatus(index: number): StepStatus {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  }

  function goToStep(index: number) {
    if (index >= 0 && index < steps.length) {
      currentStep = index;
      onStepChange?.(index);
    }
  }

  function next() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      onStepChange?.(currentStep);
    }
  }

  function prev() {
    if (currentStep > 0) {
      currentStep--;
      onStepChange?.(currentStep);
    }
  }
</script>

<div class={cn('flex', orientation === 'vertical' ? 'flex-col' : 'flex-row items-start', className)}>
  {#each steps as step, index (index)}
    {@const status = getStepStatus(index)}

    <div class={cn(
      'flex',
      orientation === 'vertical' ? 'flex-row items-start gap-4' : 'flex-col items-center gap-2 flex-1',
      index < steps.length - 1 && (orientation === 'vertical' ? 'pb-6' : '')
    )}>
      <!-- Step indicator -->
      <div class="relative flex items-center gap-3">
        <!-- Connector line (vertical) -->
        {#if orientation === 'vertical' && index < steps.length - 1}
          <div class="absolute left-4 top-10 w-0.5 h-full {status === 'completed' ? 'bg-[var(--ui-primary)]' : 'bg-[var(--ui-border)]'}"></div>
        {/if}

        <!-- Circle -->
        <button
          onclick={() => goToStep(index)}
          class={cn(
            'flex items-center justify-center size-8 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0',
            status === 'completed' ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]' : '',
            status === 'current' ? 'bg-[var(--ui-primary)]/10 text-[var(--ui-primary)] ring-2 ring-[var(--ui-primary)]/30' : '',
            status === 'upcoming' ? 'bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)]' : '',
          )}
        >
          {#if status === 'completed'}
            <Check class="size-4" />
          {:else}
            {index + 1}
          {/if}
        </button>

        <div class={cn(orientation === 'vertical' ? '' : 'hidden sm:block')}>
          <div class={cn(
            'text-sm font-medium',
            status === 'current' ? 'text-[var(--ui-foreground)]' : 'text-[var(--ui-muted-foreground)]',
          )}>
            {step.label}
          </div>
          {#if step.description}
            <div class="text-xs text-[var(--ui-muted-foreground)]/70 mt-0.5">{step.description}</div>
          {/if}
        </div>
      </div>

      <!-- Connector line (horizontal) -->
      {#if orientation === 'horizontal' && index < steps.length - 1}
        <div class="flex-1 h-0.5 mt-4 mx-2 {status === 'completed' ? 'bg-[var(--ui-primary)]' : 'bg-[var(--ui-border)]'}"></div>
      {/if}
    </div>
  {/each}
</div>

<!-- Step content -->
<div class="mt-6">
  <slot name="content" {currentStep} {next} {prev} />
</div>

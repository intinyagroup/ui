<script lang="ts">
	import { cn } from '../../utils.js';

	export type Step = {
		label: string;
		icon?: string;
	};

	let {
		steps,
		current,
		completed,
		class: className
	}: {
		steps: Step[];
		/** Currently active (0-based) step index. */
		current: number;
		/** Highest step index the user has completed; used to allow backwards jumps. */
		completed?: number;
		class?: string;
	} = $props();

	function isDone(index: number): boolean {
		return index < (completed ?? current);
	}

	function isCurrent(index: number): boolean {
		return index === current;
	}

	function onStepClick(index: number) {
		// Only allow jumping to steps that have already been completed.
		if (isDone(index) || index < (completed ?? 0)) {
			current = index;
		}
	}
</script>

<ol class={cn('flex items-center gap-0', className)} aria-label="Progress">
	{#each steps as step, i (step.label)}
		<li class="flex flex-1 items-center last:flex-none">
			{#if isCurrent(i)}
				<span class="flex w-full items-center gap-2">
					<span
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ui-primary)] font-semibold text-[var(--ui-primary-foreground)] shadow-sm"
						aria-current="step"
					>
						{#if step.icon}
							<span aria-hidden="true">{step.icon}</span>
						{:else}
							{i + 1}
						{/if}
					</span>
					<span class="truncate text-sm font-semibold text-[var(--ui-foreground)]">
						{step.label}
					</span>
				</span>
			{:else if isDone(i)}
				<button
					type="button"
					class="flex w-full items-center gap-2 text-left transition-opacity hover:opacity-70"
					onclick={() => onStepClick(i)}
				>
					<span
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ui-success)] text-[var(--ui-background)]"
						aria-hidden="true"
					>
						<span class="text-sm font-bold">✓</span>
					</span>
					<span class="truncate text-sm font-medium text-[var(--ui-muted-foreground)]">
						{step.label}
					</span>
				</button>
			{:else}
				<span class="flex w-full items-center gap-2">
					<span
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--ui-border)] text-[var(--ui-muted-foreground)]"
						aria-hidden="true"
					>
						{#if step.icon}
							<i class="not-italic opacity-60">{step.icon}</i>
						{:else}
							{i + 1}
						{/if}
					</span>
					<span class="truncate text-sm font-medium text-[var(--ui-muted-foreground)]">
						{step.label}
					</span>
				</span>
			{/if}

			{#if i < steps.length - 1}
				<span
					class={cn(
						'h-px flex-1 shrink-0 bg-[var(--ui-border)]',
						isDone(i) && 'bg-[var(--ui-success)]/50'
					)}
					aria-hidden="true"
				></span>
			{/if}
		</li>
	{/each}
</ol>
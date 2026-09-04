<script lang="ts">
	import { cn } from '../../utils.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ValidationMessage from './ValidationMessage.svelte';
	import type { ValidationRule } from './validate.js';

	let {
		value = $bindable(''),
		rules = [] as ValidationRule[],
		error = $bindable(null),
		label,
		options = [] as { value: string; label?: string }[] | string[],
		placeholder,
		class: className,
		...restProps
	}: {
		value?: string;
		rules?: ValidationRule[];
		error?: string | null;
		label?: string;
		options?: { value: string; label?: string }[] | string[];
		placeholder?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let touched = $state(false);
	let localError = $state<string | null>(null);

	function validate() {
		for (const rule of rules) {
			const result = rule.validate(value);
			if (result) {
				localError = result;
				error = result;
				return;
			}
		}
		localError = null;
		error = null;
	}

	$effect(() => {
		if (touched) validate();
	});

	function handleChange() {
		touched = true;
		validate();
	}

	function handleBlur() {
		touched = true;
		validate();
	}
</script>

<div class={cn('grid gap-1.5', className)}>
	{#if label}
		<label for={restProps.id as string | undefined} class="text-sm font-medium">{label}</label>
	{/if}
	<div class="relative">
		<select
			bind:value
			onchange={handleChange}
			onblur={handleBlur}
			aria-invalid={localError ? 'true' : undefined}
			class={cn(
				'h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
				className
			)}
			{...restProps}
		>
			{#if placeholder}
				<option value="" disabled selected>{placeholder}</option>
			{/if}
			{#each options as option (typeof option === 'string' ? option : option.value)}
				<option value={typeof option === 'string' ? option : option.value}>
					{typeof option === 'string' ? option : (option.label ?? option.value)}
				</option>
			{/each}
		</select>
		<ChevronDownIcon class="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
	</div>
	<ValidationMessage error={localError} />
</div>
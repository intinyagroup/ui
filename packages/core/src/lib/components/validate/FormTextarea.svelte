<script lang="ts">
	import { cn } from '../../utils.js';
	import Textarea from '../textarea/textarea.svelte';
	import ValidationMessage from './ValidationMessage.svelte';
	import type { ValidationRule } from './validate.js';

	let {
		value = $bindable(''),
		rules = [] as ValidationRule[],
		error = $bindable(null),
		label,
		class: className,
		...restProps
	}: {
		value?: string;
		rules?: ValidationRule[];
		error?: string | null;
		label?: string;
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

	function handleBlur() {
		touched = true;
		validate();
	}
</script>

<div class={cn('grid gap-1.5', className)}>
	{#if label}
		<label for={restProps.id as string | undefined} class="text-sm font-medium">{label}</label>
	{/if}
	<Textarea
		{value}
		onblur={handleBlur}
		aria-invalid={localError ? 'true' : undefined}
		{...restProps}
	/>
	<ValidationMessage error={localError} />
</div>

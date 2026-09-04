<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const radioVariants = tv({
		base: 'relative inline-flex items-center justify-center cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-ring)] disabled:cursor-not-allowed disabled:opacity-38',
		variants: {
			checked: {
				true: '',
				false: ''
			}
		}
	});
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		value = '',
		checked = $bindable(false),
		disabled = false,
		class: className,
		children
	}: {
		value?: string;
		checked?: boolean;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();

	// Get context from RadioGroup if present
	const group = $derived(getContext<{
		name: string;
		value: string;
		setValue: (v: string) => void;
	} | null>('radio-group'));

	const groupName = $derived(group?.name ?? '');
	const isChecked = $derived(group ? group.value === value : checked);

	function handlePointerDown() {
		if (!disabled) isPressed = true;
	}

	function handlePointerUp() {
		isPressed = false;
	}

	function handlePointerLeave() {
		isPressed = false;
		isHovered = false;
	}

	function handleChange() {
		if (disabled) return;
		if (group) {
			group.setValue(value);
		} else {
			checked = true;
		}
	}

	let isPressed = $state(false);
	let isHovered = $state(false);
</script>

<label
	class={cn(
		radioVariants({ checked: isChecked }),
		'group flex items-center gap-3 py-1.5',
		disabled && 'pointer-events-none',
		className
	)}
	onpointerenter={() => (isHovered = true)}
	onpointerleave={handlePointerLeave}
>
	<!-- Hidden native input for form integration -->
	<input
		type="radio"
		{value}
		name={groupName}
		{disabled}
		checked={isChecked}
		onchange={handleChange}
		class="sr-only"
	/>

	<!-- Radio outer circle -->
	<span
		class={cn(
			'relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
			isChecked
				? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]'
				: 'border-[var(--ui-on-surface)] bg-transparent',
			disabled && 'border-[var(--ui-on-surface)] opacity-38'
		)}
	>
		<!-- MD3 state layer -->
		<span
			class={cn(
				'pointer-events-none absolute -m-2 h-9 w-9 rounded-full bg-[var(--ui-on-surface)] transition-opacity duration-200',
				disabled
					? 'opacity-0'
					: isHovered
						? 'opacity-[0.08]'
						: 'opacity-0',
				isPressed && !disabled && 'opacity-[0.12]'
			)}
			aria-hidden="true"
		></span>

		<!-- Selected indicator dot -->
		{#if isChecked}
			<span
				class="h-2.5 w-2.5 rounded-full bg-[var(--ui-on-primary)]"
				aria-hidden="true"
			></span>
		{/if}
	</span>

	<!-- Label content -->
	{#if children}
		<span
			class={cn(
				'text-sm text-[var(--ui-on-surface)]',
				disabled && 'opacity-38'
			)}
		>
			{@render children()}
		</span>
	{/if}
</label>

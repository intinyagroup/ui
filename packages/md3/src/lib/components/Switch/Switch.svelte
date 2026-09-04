<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		checked = $bindable(false),
		disabled = false,
		class: className
	}: {
		checked?: boolean;
		disabled?: boolean;
		class?: string;
	} = $props();

	let isPressed = $state(false);

	function toggle() {
		if (disabled) return;
		checked = !checked;
	}

	function handlePointerDown() {
		if (!disabled) isPressed = true;
	}

	function handlePointerUp() {
		isPressed = false;
	}

	function handlePointerLeave() {
		isPressed = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			toggle();
		}
	}
</script>

<button
	role="switch"
	aria-checked={checked}
	aria-disabled={disabled}
	{disabled}
	onclick={toggle}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerLeave}
	onkeydown={handleKeyDown}
	class={cn(
		// Track
		'relative inline-flex h-8 w-[3.25rem] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-[var(--ui-transition-base)] ease-[cubic-bezier(0.2,0,0,1)]',
		// Track: unchecked
		!checked && 'bg-[var(--ui-surface-container-highest)]',
		// Track: checked
		checked && 'bg-[var(--ui-primary)]',
		// Disabled
		disabled && 'cursor-not-allowed opacity-38',
		// Focus ring
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-ring)]',
		className
	)}
>
	<!-- MD3 state layer -->
	<span
		class={cn(
			'pointer-events-none absolute inset-0 rounded-full bg-current transition-opacity duration-200',
			!disabled && !isPressed && 'opacity-0 hover:opacity-[0.08]',
			!disabled && isPressed && 'opacity-[0.12]',
			disabled && 'opacity-0'
		)}
		aria-hidden="true"
	></span>

	<!-- Thumb -->
	<span
		class={cn(
			'relative z-10 block h-6 w-6 rounded-full transition-all duration-[var(--ui-transition-base)] ease-[cubic-bezier(0.2,0,0,1)]',
			!checked && 'translate-x-0 bg-[var(--ui-outline)] shadow-none',
			checked && 'translate-x-5 bg-[var(--ui-on-primary)] shadow-[var(--ui-shadow-sm)]',
			isPressed && 'scale-110'
		)}
	></span>
</button>

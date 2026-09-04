<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const radioGroupVariants = tv({
		base: 'flex flex-col gap-0.5'
	});
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		value = $bindable(''),
		name = '',
		class: className,
		disabled = false,
		children
	}: {
		value?: string;
		name?: string;
		class?: string;
		disabled?: boolean;
		children?: Snippet;
	} = $props();

	// Provide name and value to child Radio components via context
	setContext('radio-group', {
		get name() {
			return name;
		},
		get value() {
			return value;
		},
		setValue(newValue: string) {
			value = newValue;
		}
	});

	function handleKeydown(event: KeyboardEvent) {
		const radios = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>(
				'input[type="radio"]:not(:disabled)'
			)
		);
		const currentIndex = radios.indexOf(
			event.target as HTMLInputElement
		);

		let nextIndex: number | null = null;

		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowRight': {
				event.preventDefault();
				nextIndex =
					currentIndex < radios.length - 1
						? currentIndex + 1
						: 0;
				break;
			}
			case 'ArrowUp':
			case 'ArrowLeft': {
				event.preventDefault();
				nextIndex =
					currentIndex > 0
						? currentIndex - 1
						: radios.length - 1;
				break;
			}
			default:
				return;
		}

		if (nextIndex !== null && radios[nextIndex]) {
			radios[nextIndex].focus();
			radios[nextIndex].click();
		}
	}
</script>

<div
	role="radiogroup"
	aria-disabled={disabled || undefined}
	class={cn(radioGroupVariants(), className)}
	onkeydown={handleKeydown}
>
	{@render children?.()}
</div>

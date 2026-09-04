<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		length = 6,
		value = $bindable(''),
		disabled = false,
		class: className,
		onComplete,
	}: {
		length?: number;
		value?: string;
		disabled?: boolean;
		class?: string;
		onComplete?: (value: string) => void;
	} = $props();

	let inputs: HTMLInputElement[] = $state([]);

	// Sync external value changes into individual inputs
	$effect(() => {
		const chars = value.split('');
		for (let i = 0; i < length; i++) {
			const el = inputs[i];
			if (el && el.value !== (chars[i] ?? '')) {
				el.value = chars[i] ?? '';
			}
		}
	});

	function emitValue() {
		const next = inputs.map((el) => el?.value ?? '').join('');
		if (next !== value) {
			value = next;
		}
		if (value.length === length) {
			onComplete?.(value);
		}
	}

	function focusInput(index: number) {
		const clamped = Math.max(0, Math.min(index, length - 1));
		requestAnimationFrame(() => inputs[clamped]?.focus());
	}

	function handleInput(index: number, e: Event) {
		const input = e.target as HTMLInputElement;
		const val = input.value.replace(/[^0-9]/g, '');

		// Keep only the last digit entered
		input.value = val.slice(-1);

		if (val && index < length - 1) {
			focusInput(index + 1);
		}

		emitValue();
	}

	function handleKeydown(index: number, e: KeyboardEvent) {
		const input = inputs[index];
		if (!input) return;

		if (e.key === 'Backspace') {
			if (input.value) {
				input.value = '';
				emitValue();
			} else if (index > 0) {
				inputs[index - 1].value = '';
				focusInput(index - 1);
				emitValue();
			}
			e.preventDefault();
		} else if (e.key === 'Delete') {
			input.value = '';
			emitValue();
			e.preventDefault();
		} else if (e.key === 'ArrowLeft' && index > 0) {
			focusInput(index - 1);
			e.preventDefault();
		} else if (e.key === 'ArrowRight' && index < length - 1) {
			focusInput(index + 1);
			e.preventDefault();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, length);
		if (!pasted) return;

		for (let i = 0; i < pasted.length; i++) {
			if (inputs[i]) inputs[i].value = pasted[i];
		}

		emitValue();
		focusInput(Math.min(pasted.length, length - 1));
	}

	function handleContainerPaste(e: ClipboardEvent) {
		handlePaste(e);
	}

	function handleFocus(e: FocusEvent) {
		(e.target as HTMLInputElement).select();
	}
</script>

<div
	class={cn('flex items-center gap-2', className)}
	onpaste={handleContainerPaste}
	role="group"
	aria-label="One-time password input"
>
	{#each Array.from({ length }, (_, i) => i) as index (index)}
		<input
			bind:this={inputs[index]}
			type="text"
			inputmode="numeric"
			autocomplete="one-time-code"
			maxlength={1}
			disabled={disabled}
			aria-label={`Digit ${index + 1} of ${length}`}
			class={cn(
				'h-12 w-10 rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] text-center font-mono text-lg outline-none transition-colors',
				'placeholder:text-muted-foreground focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-ring)]/20',
				disabled && 'cursor-not-allowed opacity-50'
			)}
			oninput={(e) => handleInput(index, e)}
			onkeydown={(e) => handleKeydown(index, e)}
			onfocus={handleFocus}
		/>
	{/each}
</div>

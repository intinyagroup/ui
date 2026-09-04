<script lang="ts">
	import { cn } from '../../utils.js';

	interface ClipboardButtonEvents {
		onCopied?: () => void;
	}

	let {
		text,
		label = 'Copy',
		copiedLabel = 'Copied!',
		class: className,
		onCopied
	}: {
		text: string;
		label?: string;
		copiedLabel?: string;
		class?: string;
	} & ClipboardButtonEvents = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy(): Promise<boolean> {
		// Modern API first
		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(text);
				return true;
			} catch {
				// fall through to execCommand
			}
		}
		// Legacy fallback
		try {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			const ok = document.execCommand('copy');
			document.body.removeChild(textarea);
			return ok;
		} catch {
			return false;
		}
	}

	async function handleCopy() {
		const ok = await copy();
		if (!ok) return;
		copied = true;
		onCopied?.();
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<button
	type="button"
	onclick={handleCopy}
	class={cn(
		'inline-flex items-center gap-2 transition-colors',
		className
	)}
	aria-live="polite"
	data-slot="clipboard-button"
>
	{#if copied}
		<span class="size-4 text-[var(--ui-success)]" aria-hidden="true">✓</span>
		<span>{copiedLabel}</span>
	{:else}
		<span class="size-4" aria-hidden="true">⧉</span>
		<span>{label}</span>
	{/if}
</button>
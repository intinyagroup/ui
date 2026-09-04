<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		color?: string;
		class?: string;
		children?: import('svelte').Snippet;
	};

	let { color = 'currentColor', class: className, children }: Props = $props();

	type RippleItem = {
		id: number;
		x: number;
		y: number;
	};

	let ripples = $state<RippleItem[]>([]);
	let nextId = 0;
	let containerEl: HTMLDivElement;

	function addRipple(event: PointerEvent) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const id = nextId++;
		ripples = [...ripples, { id, x, y }];

		// Remove ripple after animation completes
		setTimeout(() => {
			ripples = ripples.filter((r) => r.id !== id);
		}, 600);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={containerEl}
	class={cn('relative', className)}
	onpointerdown={addRipple}
>
	{@render children?.()}
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		{#each ripples as ripple (ripple.id)}
			<span
				class="ripple"
				style:left="{ripple.x}px;top:{ripple.y}px;--ripple-color:{color}"
			></span>
		{/each}
	</div>
</div>

<style>
	.ripple {
		position: absolute;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%) scale(0);
		border-radius: 50%;
		background-color: var(--ripple-color, currentColor);
		opacity: 0.12;
		pointer-events: none;
		animation: ripple-expand 600ms ease-out forwards;
	}

	@keyframes ripple-expand {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0.12;
		}
		100% {
			transform: translate(-50%, -50%) scale(4);
			opacity: 0;
		}
	}
</style>

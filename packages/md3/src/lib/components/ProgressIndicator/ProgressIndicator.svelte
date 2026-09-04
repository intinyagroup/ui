<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		value,
		variant = 'linear',
		class: className
	}: {
		value?: number;
		variant?: 'linear' | 'circular';
		class?: string;
	} = $props();

	let indeterminate = $derived(value === undefined);
	let clampedValue = $derived(indeterminate ? 0 : Math.max(0, Math.min(100, value)));
</script>

{#if variant === 'linear'}
	<div
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : clampedValue}
		aria-valuemin={0}
		aria-valuemax={100}
		class={cn(
			'group relative h-1 w-full overflow-hidden rounded-full bg-[var(--ui-secondary-container)]',
			className
		)}
	>
		{#if indeterminate}
			<div
				class="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[var(--ui-primary)] transition-colors duration-200"
				style="animation: md3-linear-indeterminate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite"
			></div>
		{:else}
			<div
				class="absolute inset-y-0 left-0 rounded-full bg-[var(--ui-primary)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
				style="width: {clampedValue}%"
			></div>
		{/if}
	</div>
{:else}
	<div
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : clampedValue}
		aria-valuemin={0}
		aria-valuemax={100}
		class={cn(
			'relative h-12 w-12',
			className
		)}
	>
		<svg
			viewBox="0 0 48 48"
			class="h-full w-full {indeterminate ? 'animate-spin' : ''}"
			style={indeterminate
				? 'animation-duration: 1.4s; animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1)'
				: undefined}
		>
			<!-- Track -->
			<circle
				cx="24"
				cy="24"
				r="20"
				fill="none"
				class="stroke-[var(--ui-secondary-container)]"
				stroke-width="4"
			/>
			{#if indeterminate}
				<!-- Indeterminate arc -->
				<circle
					cx="24"
					cy="24"
					r="20"
					fill="none"
					class="stroke-[var(--ui-primary)] transition-colors duration-200"
					stroke-width="4"
					stroke-linecap="round"
					stroke-dasharray="80 126"
					style="animation: md3-circular-rotate 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
								 transform-origin: center"
				/>
			{:else}
				<!-- Determinate arc -->
				<circle
					cx="24"
					cy="24"
					r="20"
					fill="none"
					class="stroke-[var(--ui-primary)] transition-colors duration-200"
					stroke-width="4"
					stroke-linecap="round"
					stroke-dasharray="{(clampedValue / 100) * 125.66} 125.66"
					style="transform: rotate(-90deg); transform-origin: center;
								 transition: stroke-dasharray 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
				/>
			{/if}
		</svg>
	</div>
{/if}

<style>
	@keyframes md3-linear-indeterminate {
		0% {
			left: -35%;
			width: 35%;
		}
		60% {
			left: 100%;
			width: 35%;
		}
		100% {
			left: 100%;
			width: 35%;
		}
	}

	@keyframes md3-circular-rotate {
		0% {
			transform: rotate(0deg);
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dashoffset: -35;
			transform: rotate(270deg);
		}
		100% {
			stroke-dashoffset: -126;
			transform: rotate(720deg);
		}
	}
</style>

<script lang="ts">
	import { cn } from '$lib/utils';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
	type Size = 'sm' | 'md' | 'lg';

	let {
		value,
		label,
		color = 'blue',
		size = 'md',
		class: className
	}: {
		value: string;
		label: string;
		color?: Color;
		size?: Size;
		class?: string;
	} = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'w-24 h-24',
		md: 'w-32 h-32',
		lg: 'w-40 h-40'
	};

	const valueSizeClasses: Record<Size, string> = {
		sm: 'text-lg',
		md: 'text-2xl',
		lg: 'text-3xl'
	};

	const labelSizeClasses: Record<Size, string> = {
		sm: 'text-[0.625rem]',
		md: 'text-xs',
		lg: 'text-sm'
	};
</script>

<div
	class={cn('flex flex-col items-center justify-center text-white', sizeClasses[size], className)}
	style:background-color="var(--flat-{color})"
	style:clip-path="polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
>
	<span class={cn('font-bold leading-none', valueSizeClasses[size])}>{value}</span>
	<span class={cn('leading-none opacity-90', labelSizeClasses[size])}>{label}</span>
</div>

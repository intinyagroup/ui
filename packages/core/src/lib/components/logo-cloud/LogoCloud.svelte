<script lang="ts">
	import { cn } from '../../utils.js';

	type LogoItem = {
		src: string;
		alt: string;
		href?: string;
	};

	let {
		logos = [],
		class: className,
	}: {
		logos?: LogoItem[];
		class?: string;
	} = $props();
</script>

<div class={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center', className)}>
	{#each logos as logo (logo.alt)}
		<div class="flex items-center justify-center p-4 transition-all duration-300">
			{#if logo.href}
				<a
					href={logo.href}
					target="_blank"
					rel="noopener noreferrer"
					class="block"
				>
					<img
						src={logo.src}
						alt={logo.alt}
						class="h-10 sm:h-12 md:h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
					/>
				</a>
			{:else}
				<img
					src={logo.src}
					alt={logo.alt}
					class="h-10 sm:h-12 md:h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
				/>
			{/if}
		</div>
	{/each}
</div>

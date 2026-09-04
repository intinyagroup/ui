<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';

	let {
		color = 'blue',
		height = '24px',
		class: className
	}: {
		color?: Color;
		height?: string;
		class?: string;
	} = $props();

	const colorVarMap: Record<Color, string> = {
		red: 'var(--flat-red)',
		blue: 'var(--flat-blue)',
		green: 'var(--flat-green)',
		purple: 'var(--flat-purple)',
		pink: 'var(--flat-pink)',
		orange: 'var(--flat-orange)',
		teal: 'var(--flat-teal)'
	};
</script>

<div class={cn('w-full overflow-hidden leading-[0]', className)} style:height>
	<svg
		class="block w-full h-full"
		viewBox="0 0 1440 40"
		preserveAspectRatio="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon
			points="0,40 30,0 60,40 90,0 120,40 150,0 180,40 210,0 240,40 270,0 300,40 330,0 360,40 390,0 420,40 450,0 480,40 510,0 540,40 570,0 600,40 630,0 660,40 690,0 720,40 750,0 780,40 810,0 840,40 870,0 900,40 930,0 960,40 990,0 1020,40 1050,0 1080,40 1110,0 1140,40 1170,0 1200,40 1230,0 1260,40 1290,0 1320,40 1350,0 1380,40 1410,0 1440,40"
			fill={colorVarMap[color]}
		/>
	</svg>
</div>

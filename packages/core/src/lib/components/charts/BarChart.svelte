<script lang="ts">
	import Chart from 'chart.js/auto';
	import type { ChartData, ChartOptions } from 'chart.js/auto';
	import { cn } from '../../utils.js';

	/** @description Vertical bar chart powered by chart.js. Dark-mode aware. */
	type Props = {
		data: ChartData<'bar'>;
		options?: ChartOptions<'bar'>;
		height?: number;
		class?: string;
	};

	let {
		data,
		options = {},
		height = 300,
		class: className
	}: Props = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let chart: Chart<'bar'> | null = null;
	let dark = $state(false);

	function css(name: string, fallback: string): string {
		return (
			getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
			fallback
		);
	}

	$effect(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		dark = mq.matches;
		const onChange = () => {
			dark = mq.matches;
		};
		mq.addEventListener('change', onChange);

		render();

		return () => {
			mq.removeEventListener('change', onChange);
			chart?.destroy();
			chart = null;
		};
	});

	function render() {
		if (!canvas) return;
		chart?.destroy();

		const foreground = css('--ui-foreground', dark ? '#e2e8f0' : '#0f172a');
		const grid = dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
		const tooltipBg = css('--ui-card', dark ? '#1e293b' : '#ffffff');
		const tooltipBorder = css('--ui-border', dark ? '#334155' : '#e2e8f0');
		const tooltipText = foreground;

		chart = new Chart(canvas, {
			type: 'bar',
			data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				color: foreground,
				borderColor: grid,
				backgroundColor: grid,
				scales: {
					x: { grid: { color: grid }, ticks: { color: foreground } },
					y: { grid: { color: grid }, ticks: { color: foreground } }
				},
				plugins: {
					legend: { labels: { color: foreground } },
					tooltip: {
						backgroundColor: tooltipBg,
						borderColor: tooltipBorder,
						borderWidth: 1,
						titleColor: tooltipText,
						bodyColor: tooltipText
					}
				},
				...options
			}
		});
	}
</script>

<div class={cn('relative w-full', className)} style="height: {height}px;">
	<canvas bind:this={canvas}></canvas>
</div>
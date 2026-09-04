<script lang="ts">
	import { cn } from '../../utils.js';

	export type HeatmapCell = {
		x: string | number;
		y: string | number;
		value: number;
	};

	let {
		data,
		colorScale,
		xLabels,
		yLabels,
		showLegend = true,
		cellSize = 'h-8 w-8',
		class: className
	}: {
		data: HeatmapCell[];
		/** CSS color stops used to interpolate cell intensity (low → high). */
		colorScale?: [string, string, string];
		xLabels?: (string | number)[];
		yLabels?: (string | number)[];
		showLegend?: boolean;
		cellSize?: string;
		class?: string;
	} = $props();

	const scale = colorScale ?? ['#ebedf0', '#9be9a8', '#216e39'];

	const values = $derived(data.map((d) => d.value));
	const min = $derived(values.length ? Math.min(...values) : 0);
	const max = $derived(values.length ? Math.max(...values) : 0);

	const xKeys = $derived([...new Set(data.map((d) => d.x))]);
	const yKeys = $derived([...new Set(data.map((d) => d.y))]);
	const labelsX = $derived(xLabels ?? xKeys);
	const labelsY = $derived(yLabels ?? yKeys);

	function colorFor(value: number): string {
		const range = max - min;
		if (range === 0) return scale[2];
		const t = range === 0 ? 1 : (value - min) / range;
		return interpolate(scale[0], scale[1], scale[2], t);
	}

	function interpolate(a: string, b: string, c: string, t: number): string {
		const colors = [a, b, c];
		const seg = t * (colors.length - 1);
		const i = Math.min(Math.floor(seg), colors.length - 2);
		const local = seg - i;
		return lerpColor(colors[i], colors[i + 1], local);
	}

	function lerpColor(from: string, to: string, t: number): string {
		const f = parseHex(from);
		const g = parseHex(to);
		const r = Math.round(f[0] + (g[0] - f[0]) * t);
		const gg = Math.round(f[1] + (g[1] - f[1]) * t);
		const b = Math.round(f[2] + (g[2] - f[2]) * t);
		return `rgb(${r}, ${gg}, ${b})`;
	}

	function parseHex(hex: string): [number, number, number] {
		const h = hex.replace('#', '');
		const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
		const n = parseInt(full, 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	}

	function cellValue(x: string | number, y: string | number): number | undefined {
		return data.find((d) => String(d.x) === String(x) && String(d.y) === String(y))?.value;
	}
</script>

<div class={cn('inline-flex flex-col gap-1', className)}>
	<div class="overflow-x-auto">
		<div class="inline-block">
			{#if labelsX.length}
				<div class="flex gap-1 pb-1 pl-8">
					{#each labelsX as label, i (i)}
						<div
							class={cn('flex items-end justify-center text-[10px] text-[var(--ui-muted-foreground)]', cellSize)}
							aria-hidden="true"
						>
							{label}
						</div>
					{/each}
				</div>
			{/if}
			<div class="flex gap-1">
				{#if labelsY.length}
					<div class="flex w-8 flex-col gap-1">
						{#each labelsY as label, i (i)}
							<div
								class={cn('flex items-center justify-end pr-1 text-[10px] text-[var(--ui-muted-foreground)]', cellSize)}
								aria-hidden="true"
							>
								{label}
							</div>
						{/each}
					</div>
				{/if}
				<div class="flex flex-col gap-1">
					{#each labelsY as y, yi (String(y))}
						<div class="flex gap-1">
							{#each labelsX as x, xi (String(x))}
								{@const value = cellValue(x, y)}
								<div
									class={cn('rounded-[4px]', cellSize)}
									style={value !== undefined ? `background-color: ${colorFor(value)};` : undefined}
									role={value !== undefined ? 'img' : undefined}
									aria-label={value !== undefined ? `${x}, ${y}: ${value}` : undefined}
									title={value !== undefined ? `${x}, ${y}: ${value}` : undefined}
								></div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	{#if showLegend && max > 0}
		<div class="flex items-center gap-1.5 pl-8 pt-1" aria-hidden="true">
			<span class="text-[10px] text-[var(--ui-muted-foreground)]">Less</span>
			{#each scale as color, i (i)}
				<span class={cn('rounded-[3px]', cellSize)} style={`background-color: ${color};`}></span>
			{/each}
			<span class="text-[10px] text-[var(--ui-muted-foreground)]">More</span>
		</div>
	{/if}
</div>
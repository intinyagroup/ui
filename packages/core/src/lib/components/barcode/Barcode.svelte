<script lang="ts">
	import JsBarcode from 'jsbarcode';
	import { cn } from '../../utils.js';

	let {
		value,
		format = 'code128',
		height = 80,
		width = 2,
		displayValue = true,
		class: className,
	}: {
		value: string;
		format?: 'code128' | 'ean13' | 'upc';
		height?: number;
		width?: number;
		displayValue?: boolean;
		class?: string;
	} = $props();

	let svgRef = $state<SVGSVGElement | null>(null);

	$effect(() => {
		if (svgRef && value) {
			try {
				JsBarcode(svgRef, value, {
					format,
					height,
					width,
					displayValue,
					margin: 4,
				});
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('[Barcode] Failed to generate barcode:', e);
			}
		}
	});
</script>

<svg bind:this={svgRef} class={cn('inline-block', className)}></svg>

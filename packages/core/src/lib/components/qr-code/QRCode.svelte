<script lang="ts">
	import qrcode from 'qrcode';
	import { cn } from '../../utils.js';

	type Level = 'L' | 'M' | 'Q' | 'H';

	let {
		value,
		size = 200,
		fgColor = '#000000',
		bgColor = '#ffffff',
		level = 'M',
		class: className,
		onReady = () => {},
	}: {
		value: string;
		size?: number;
		fgColor?: string;
		bgColor?: string;
		level?: Level;
		class?: string;
		onReady?: (svg: string) => void;
	} = $props();

	let svg = $state('');

	$effect(() => {
		// Regenerate whenever inputs change.
		const opts = { width: size, margin: 2, errorCorrectionLevel: level };
		void qrcode
			.toString(value, {
				type: 'svg',
				width: opts.width,
				margin: opts.margin,
				errorCorrectionLevel: opts.errorCorrectionLevel,
				color: { dark: fgColor, light: bgColor },
			})
			.then((markup) => {
				svg = markup;
				onReady(markup);
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.error('[QRCode] Failed to generate QR code:', err);
			});
	});
</script>

{#if svg}
	<div class={cn('inline-block', className)}>{@html svg}</div>
{/if}
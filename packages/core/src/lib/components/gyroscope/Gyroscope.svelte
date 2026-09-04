<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';

	type Reading = { alpha: number; beta: number; gamma: number };

	interface GyroscopeEvents {
		onReading?: (data: Reading) => void;
	}

	interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
		requestPermission?: () => Promise<'granted' | 'denied'>;
	}

	interface DeviceMotionEventWithPermission extends DeviceMotionEvent {
		requestPermission?: () => Promise<'granted' | 'denied'>;
	}

	let {
		enabled = $bindable(true),
		sensitivity = 1,
		class: className,
		children,
		onReading
	}: {
		enabled?: boolean;
		sensitivity?: number;
		class?: string;
		children?: Snippet<[Reading]>;
	} & GyroscopeEvents = $props();

	let reading = $state<Reading>({ alpha: 0, beta: 0, gamma: 0 });
	let supported = $state(false);
	let permissionState = $state<'granted' | 'denied' | 'unknown' | 'unavailable'>('unknown');
	let mode = $state<'device' | 'mouse'>('mouse');
	let isSimulating = $state(false);

	let lastMouse = { x: 0, y: 0 };
	let mouseTarget = { alpha: 0, beta: 0, gamma: 0 };
	let rafId: number | null = null;

	const usesPermissionApi =
		typeof DeviceOrientationEvent !== 'undefined' &&
		typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission).requestPermission ===
			'function';

	function clamp(v: number, min: number, max: number) {
		return Math.min(max, Math.max(min, v));
	}

	function applySensitivity(data: Reading): Reading {
		const k = sensitivity;
		return {
			alpha: ((data.alpha % 360) + 360) % 360,
			beta: clamp(data.beta * k, -180, 180),
			gamma: clamp(data.gamma * k, -90, 90)
		};
	}

	function emit(data: Reading) {
		reading = data;
		onReading?.(data);
	}

	async function requestPermission(): Promise<boolean> {
		if (!usesPermissionApi) return true;
		try {
			const orientation = DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;
			const result = await orientation.requestPermission!();
			permissionState = result;
			const motion = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;
			if (typeof motion.requestPermission === 'function') {
				const motionResult = await motion.requestPermission();
				permissionState = motionResult === 'granted' ? 'granted' : 'denied';
				return motionResult === 'granted';
			}
			return true;
		} catch {
			permissionState = 'denied';
			return false;
		}
	}

	function startDevice() {
		if (usesPermissionApi) {
			requestPermission().then((granted) => {
				if (granted) attachDeviceListeners();
				else mode = 'mouse';
			});
		} else {
			attachDeviceListeners();
		}
	}

	function attachDeviceListeners() {
		if ('DeviceOrientationEvent' in window) {
			window.addEventListener('deviceorientation', onOrientation);
		}
		if ('DeviceMotionEvent' in window) {
			window.addEventListener('devicemotion', onMotion);
		}
	}

	function onOrientation(event: DeviceOrientationEvent) {
		// Ignore synthetic events (e.g. Chrome's fake ~90/0/0 on desktop) once
		// real device data has arrived.
		if (event.alpha === null && event.beta === null && event.gamma === null) return;
		// Chrome fires a synthetic null event on desktop with alpha=90, beta=0, gamma=0
		if (event.alpha === 90 && event.beta === 0 && event.gamma === 0) return;
		// A real device event switches us out of the mouse-simulation fallback.
		if (mode !== 'device') mode = 'device';
		if (!supported) supported = true;
		emit(
			applySensitivity({
				alpha: event.alpha ?? 0,
				beta: event.beta ?? 0,
				gamma: event.gamma ?? 0
			})
		);
	}

	function onMotion(event: DeviceMotionEvent) {
		const acc = event.accelerationIncludingGravity;
		if (!acc) return;
		// Derive approximate orientation from gravity vector (no-op when
		// accelerationIncludingGravity is unavailable).
		if (acc.x === null && acc.y === null && acc.z === null) return;
		// A real device motion event switches us out of the mouse fallback.
		if (mode !== 'device') mode = 'device';
		const x = acc.x ?? 0;
		const y = acc.y ?? 0;
		const z = acc.z ?? 0;
		const norm = Math.sqrt(x * x + y * y + z * z) || 1;
		// beta ~ tilt around X axis (front/back), gamma ~ tilt around Y axis (left/right)
		const beta = clamp(Math.asin(clamp(y / norm, -1, 1)) * (180 / Math.PI), -180, 180);
		const gamma = clamp(Math.asin(clamp(x / norm, -1, 1)) * (180 / Math.PI), -90, 90);
		if (!supported) supported = true;
		emit(applySensitivity({ alpha: reading.alpha, beta, gamma }));
	}

	function onMouseMove(event: MouseEvent) {
		if (mode !== 'mouse') return;
		const dx = event.clientX - lastMouse.x;
		const dy = event.clientY - lastMouse.y;
		lastMouse = { x: event.clientX, y: event.clientY };
		// Map cursor deltas to orientation space
		mouseTarget.alpha = (mouseTarget.alpha + dx * 0.5) % 360;
		mouseTarget.beta = clamp(mouseTarget.beta + dy * 0.5, -90, 90);
		mouseTarget.gamma = clamp(mouseTarget.gamma + dx * 0.15, -45, 45);
	}

	function startMouseSimulation() {
		mode = 'mouse';
		window.addEventListener('mousemove', onMouseMove);
		if (rafId !== null) cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(tick);
	}

	function tick() {
		// Ease toward the mouse target for smooth simulated motion
		const ease = 0.15;
		reading = {
			alpha: reading.alpha + (mouseTarget.alpha - reading.alpha) * ease,
			beta: reading.beta + (mouseTarget.beta - reading.beta) * ease,
			gamma: reading.gamma + (mouseTarget.gamma - reading.gamma) * ease
		};
		onReading?.(reading);
		rafId = requestAnimationFrame(tick);
	}
	function stopAll() {
		window.removeEventListener('deviceorientation', onOrientation);
		window.removeEventListener('devicemotion', onMotion);
		window.removeEventListener('mousemove', onMouseMove);
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	}

	function handleToggle() {
		enabled = !enabled;
		if (enabled) start();
		else stopAll();
	}

	function start() {
		if ('DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window) {
			startDevice();
			// Fall back to mouse simulation until a real device event arrives
			startMouseSimulation();
		} else {
			permissionState = 'unavailable';
			startMouseSimulation();
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (enabled) start();
		else stopAll();
		return () => {
			stopAll();
		};
	});

	$effect(() => {
		if (mode === 'device') {
			stopAll();
			startDevice();
		}
	});
</script>

<div
	class={cn(
		'inline-flex flex-col gap-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-background)] p-4',
		className
	)}
	data-slot="gyroscope"
>
	<div class="flex items-center justify-between gap-3">
		<div class="text-sm font-medium">
			Device Orientation
			{#if mode === 'mouse'}
				<span class="ml-2 rounded-full bg-[var(--ui-secondary)] px-2 py-0.5 text-xs">Simulated (mouse)</span>
			{/if}
			{#if permissionState === 'denied'}
				<span class="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Permission denied</span>
			{/if}
		</div>
		<button
			type="button"
			role="switch"
			aria-checked={enabled}
			aria-label="Toggle gyroscope"
			onclick={handleToggle}
			class={cn(
				'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
				enabled ? 'bg-[var(--ui-primary)]' : 'bg-[var(--ui-secondary)]'
			)}
		>
			<span
				class={cn(
					'inline-block size-3.5 transform rounded-full bg-white shadow transition-transform',
					enabled ? 'translate-x-4.5' : 'translate-x-0.5'
				)}
			></span>
		</button>
	</div>

	<div class="grid grid-cols-3 gap-2 font-mono text-xs tabular-nums">
		<div class="rounded-md bg-[var(--ui-secondary)]/60 p-2 text-center">
			<div class="text-[var(--ui-muted-foreground)]">α</div>
			<div>{reading.alpha.toFixed(1)}°</div>
		</div>
		<div class="rounded-md bg-[var(--ui-secondary)]/60 p-2 text-center">
			<div class="text-[var(--ui-muted-foreground)]">β</div>
			<div>{reading.beta.toFixed(1)}°</div>
		</div>
		<div class="rounded-md bg-[var(--ui-secondary)]/60 p-2 text-center">
			<div class="text-[var(--ui-muted-foreground)]">γ</div>
			<div>{reading.gamma.toFixed(1)}°</div>
		</div>
	</div>

	{#if children}
		{@render children(reading)}
	{/if}
</div>

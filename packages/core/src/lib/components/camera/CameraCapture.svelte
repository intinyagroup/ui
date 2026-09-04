<script lang="ts">
	import { cn } from '../../utils.js';

	interface CameraCaptureEvents {
		onCapture?: (file: File | Blob) => void;
	}

	let {
		facing = 'user',
		width = 640,
		class: className,
		onCapture
	}: {
		facing?: 'user' | 'environment';
		width?: number;
		class?: string;
	} & CameraCaptureEvents = $props();

	let videoRef = $state<HTMLVideoElement | null>(null);
	let stream = $state<MediaStream | null>(null);
	let error = $state<string | null>(null);
	let isActive = $state(false);
	let isReady = $state(false);
	let fileRef = $state<HTMLInputElement | null>(null);
	let capturingPreview = $state<string | null>(null);

	function constraints(): MediaStreamConstraints {
		return {
			audio: false,
			video: {
				facingMode: facing,
				width: { ideal: width },
				height: { ideal: width * 1.33 }
			}
		};
	}

	async function startStream() {
		if (!navigator.mediaDevices?.getUserMedia) {
			error = 'Camera not supported';
			isActive = false;
			return;
		}
		stopStream();
		try {
			stream = await navigator.mediaDevices.getUserMedia(constraints());
			isActive = true;
			error = null;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unable to access camera';
			isActive = false;
			// Fall back to file input when access is denied / unavailable
			fileRef?.click();
		}
	}

	function stopStream() {
		stream?.getTracks().forEach((track) => track.stop());
		stream = null;
		isActive = false;
		isReady = false;
	}

	function capture() {
		if (!videoRef || !isReady) return;
		const canvas = document.createElement('canvas');
		canvas.width = videoRef.videoWidth;
		canvas.height = videoRef.videoHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
		canvas.toBlob((blob) => {
			if (!blob) return;
			const name = `capture-${Date.now()}.jpg`;
			const file = new File([blob], name, { type: blob.type });
			capturingPreview = URL.createObjectURL(blob);
			onCapture?.(file);
		}, 'image/jpeg', 0.92);
	}

	function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		capturingPreview = URL.createObjectURL(file);
		onCapture?.(file);
	}

	function handleToggle() {
		if (isActive) stopStream();
		else startStream();
	}

	$effect(() => {
		const video = videoRef;
		if (video && stream) {
			video.srcObject = stream;
			video.play().catch(() => undefined);
		}
		return () => {
			// Cleanup handled on unmount via stopStream below
		};
	});

	$effect(() => () => {
		stopStream();
		if (capturingPreview) URL.revokeObjectURL(capturingPreview);
	});
</script>

<div class={cn('flex flex-col gap-3', className)} data-slot="camera-capture">
	<div
		class="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[var(--ui-border)] bg-black"
	>
		{#if isActive}
			<video
				bind:this={videoRef}
				autoplay
				muted
				playsinline
				class="h-full w-full object-cover"
			></video>
		{:else if capturingPreview}
			<img src={capturingPreview} alt="Captured preview" class="h-full w-full object-cover" />
		{:else}
			<div class="flex h-full w-full items-center justify-center text-sm text-white/60">
				Camera preview
			</div>
		{/if}
	</div>

	{#if error}
		<p class="text-xs text-red-600" role="alert">{error}</p>
	{/if}

	<div class="flex items-center justify-center gap-2">
		<button
			type="button"
			onclick={handleToggle}
			class={cn(
				'rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors',
				isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-[var(--ui-primary)] hover:opacity-90'
			)}
		>
			{isActive ? 'Stop' : 'Start Camera'}
		</button>
		{#if isActive}
			<button
				type="button"
				disabled={!isReady}
				onclick={capture}
				class="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors disabled:cursor-not-allowed disabled:opacity-40"
			>
				Capture
			</button>
		{/if}
		<input
			bind:this={fileRef}
			type="file"
			accept="image/*"
			capture={facing === 'environment' ? 'environment' : 'user'}
			class="hidden"
			onchange={handleFileChange}
		/>
	</div>
</div>
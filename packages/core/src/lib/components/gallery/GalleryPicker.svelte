<script lang="ts">
	import { cn, isImageFile } from '../../utils.js';

	interface GalleryPickerEvents {
		onSelect?: (files: File[]) => void;
	}

	let {
		multiple = true,
		accept = 'image/*',
		maxFiles = 10,
		class: className,
		onSelect
	}: {
		multiple?: boolean;
		accept?: string;
		maxFiles?: number;
		class?: string;
	} & GalleryPickerEvents = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let fileList = $state<File[]>([]);
	let previews = $state<string[]>([]);
	let isDragging = $state(false);
	let error = $state<string | null>(null);

	function objectUrl(file: File): string {
		return URL.createObjectURL(file);
	}

	function addFiles(files: File[]) {
		error = null;
		const target = multiple ? [...fileList, ...files] : files.slice(0, 1);
		const capped = multiple ? target.slice(0, maxFiles) : target;
		if (multiple && target.length > maxFiles) {
			error = `Only ${maxFiles} files allowed`;
		}
		// Clean up old previews
		previews.forEach((url) => URL.revokeObjectURL(url));
		fileList = capped;
		previews = capped.map(objectUrl);
	}

	function handleChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = input.files ? Array.from(input.files) : [];
		addFiles(files);
		if (input) input.value = '';
	}

	function openPicker() {
		inputRef?.click();
	}

	function removeFile(index: number) {
		URL.revokeObjectURL(previews[index]);
		fileList = fileList.filter((_, i) => i !== index);
		previews = previews.filter((_, i) => i !== index);
		onSelect?.(fileList);
	}

	function clearAll() {
		fileList = [];
		previews = [];
		onSelect?.([]);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		const files = event.dataTransfer
			? Array.from(event.dataTransfer.files).filter((f) =>
					accept === 'image/*' ? f.type.startsWith('image/') : true
				)
			: [];
		addFiles(files);
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}
</script>

<div class={cn('flex flex-col gap-3', className)} data-slot="gallery-picker">
	<div
		role="button"
		tabindex="0"
		onclick={openPicker}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openPicker();
			}
		}}
		ondragover={handleDragOver}
		ondrop={handleDrop}
		ondragleave={handleDragLeave}
		class={cn(
			'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors',
			isDragging
				? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/10'
				: 'border-[var(--ui-border)]'
		)}
	>

		<div class="mb-2 text-3xl text-[var(--ui-muted-foreground)]">＋</div>
		<p class="text-sm font-medium">Drop images here or</p>
		<button
			type="button"
			onclick={openPicker}
			class="mt-2 rounded-md bg-[var(--ui-primary)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
		>
			Browse
		</button>
		{#if multiple}
			<p class="mt-2 text-xs text-[var(--ui-muted-foreground)]">
				Up to {maxFiles} files
			</p>
		{/if}
	</div>

	{#if error}
		<p class="text-xs text-red-600" role="alert">{error}</p>
	{/if}

	{#if previews.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each previews as url, i (url)}
				<div class="group relative size-20 overflow-hidden rounded-md border border-[var(--ui-border)]">
					<img src={url} alt={fileList[i]?.name ?? ''} class="size-full object-cover" />
					<button
						type="button"
						aria-label={`Remove ${fileList[i]?.name ?? 'file'}`}
						onclick={() => removeFile(i)}
						class="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
					>
						×
					</button>
				</div>
			{/each}
		</div>
		<div class="flex items-center justify-between text-xs text-[var(--ui-muted-foreground)]">
			<span>{fileList.length} file{fileList.length === 1 ? '' : 's'} selected</span>
			<button
				type="button"
				onclick={clearAll}
				class="text-[var(--ui-primary)] hover:underline"
			>
				Clear all
			</button>
		</div>
	{/if}

	<input
		bind:this={inputRef}
		type="file"
		accept={accept}
		multiple={multiple}
		class="hidden"
		onchange={handleChange}
	/>
</div>
<script lang="ts">
	import type { PlaygroundProp } from './Playground.svelte';

	let {
		schema = [] as PlaygroundProp[],
		values,
		onchange
	}: {
		schema?: PlaygroundProp[];
		values: Record<string, any>;
		onchange: (name: string, value: any) => void;
	} = $props();
</script>

<div class="flex flex-col gap-3">
	{#each schema as prop (prop.name)}
		{#if prop.type === 'string'}
			<label class="flex flex-col gap-1">
				<span class="text-[11px] font-medium text-[var(--ui-muted-foreground)]">
					{prop.label ?? prop.name}
				</span>
				<input
					type="text"
					value={values[prop.name]}
					placeholder={prop.default ?? ''}
					oninput={(e) => onchange(prop.name, e.currentTarget.value)}
					class="h-7 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] px-2 text-xs outline-none focus-visible:border-[var(--ui-ring)] focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]/40"
				/>
			</label>
		{:else if prop.type === 'enum'}
			<label class="flex flex-col gap-1">
				<span class="text-[11px] font-medium text-[var(--ui-muted-foreground)]">
					{prop.label ?? prop.name}
				</span>
				<select
					value={values[prop.name]}
					onchange={(e) => onchange(prop.name, e.currentTarget.value)}
					class="h-7 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] px-2 text-xs outline-none focus-visible:border-[var(--ui-ring)] focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]/40"
				>
					{#each prop.values ?? [] as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</label>
		{:else if prop.type === 'number'}
			<label class="flex flex-col gap-1">
				<span class="text-[11px] font-medium text-[var(--ui-muted-foreground)]">
					{prop.label ?? prop.name}
				</span>
				{#if prop.min !== undefined && prop.max !== undefined}
					<div class="flex items-center gap-2">
						<input
							type="range"
							min={prop.min}
							max={prop.max}
							step={prop.step ?? 1}
							value={values[prop.name]}
							oninput={(e) => onchange(prop.name, Number(e.currentTarget.value))}
							class="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--ui-muted)] accent-[var(--ui-primary)]"
						/>
						<input
							type="number"
							min={prop.min}
							max={prop.max}
							step={prop.step ?? 1}
							value={values[prop.name]}
							oninput={(e) => onchange(prop.name, Number(e.currentTarget.value))}
							class="w-14 rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] px-1.5 py-0.5 text-right text-xs outline-none focus-visible:border-[var(--ui-ring)]"
						/>
					</div>
				{:else}
					<input
						type="number"
						value={values[prop.name]}
						oninput={(e) => onchange(prop.name, Number(e.currentTarget.value))}
						class="h-7 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] px-2 text-xs outline-none focus-visible:border-[var(--ui-ring)] focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]/40"
					/>
				{/if}
			</label>
		{:else if prop.type === 'boolean'}
			<label class="flex cursor-pointer items-center justify-between gap-2">
				<span class="text-[11px] font-medium text-[var(--ui-muted-foreground)]">
					{prop.label ?? prop.name}
				</span>
				<button
					type="button"
					role="switch"
					aria-label={prop.label ?? prop.name}
					aria-checked={values[prop.name]}
					onclick={() => onchange(prop.name, !values[prop.name])}
					class="relative h-5 w-9 rounded-full transition-colors {values[prop.name]
						? 'bg-[var(--ui-primary)]'
						: 'bg-[var(--ui-muted)] border border-[var(--ui-border)]'}"
				>
					<span
						class="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-white shadow transition-all {values[prop.name] ? 'left-[calc(100%-1rem)]' : 'left-[0.125rem]'}"
					></span>
				</button>
			</label>
		{:else if prop.type === 'color'}
			<label class="flex flex-col gap-1">
				<span class="text-[11px] font-medium text-[var(--ui-muted-foreground)]">
					{prop.label ?? prop.name}
				</span>
				<div class="flex items-center gap-2">
					<input
						type="color"
						value={values[prop.name]}
						oninput={(e) => onchange(prop.name, e.currentTarget.value)}
						class="size-7 cursor-pointer rounded-md border border-[var(--ui-border)] bg-transparent p-0.5"
					/>
					<input
						type="text"
						value={values[prop.name]}
						oninput={(e) => onchange(prop.name, e.currentTarget.value)}
						class="h-7 flex-1 rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] px-2 font-mono text-xs outline-none focus-visible:border-[var(--ui-ring)]"
					/>
				</div>
			</label>
		{/if}
		{#if prop.description}
			<p class="-mt-1.5 text-[10px] leading-snug text-[var(--ui-muted-foreground)]/70">{prop.description}</p>
		{/if}
	{/each}
</div>
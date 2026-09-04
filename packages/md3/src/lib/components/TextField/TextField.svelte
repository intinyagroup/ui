<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		value = $bindable(''),
		label = '',
		placeholder = '',
		variant = 'filled',
		error = undefined,
		disabled = false,
		class: className,
		id = undefined,
		type = 'text',
		helperText = undefined,
		...restProps
	}: {
		value?: string;
		label?: string;
		placeholder?: string;
		variant?: 'filled' | 'outlined';
		error?: string;
		disabled?: boolean;
		class?: string;
		id?: string;
		type?: string;
		helperText?: string;
		[key: string]: unknown;
	} = $props();

	let focused = $state(false);

	const inputId = $derived(id || `md3-textfield-${label?.replace(/\s+/g, '-').toLowerCase() || 'input'}`);
	const hasValue = $derived(value.length > 0);
	const isFloated = $derived(focused || hasValue);
	const showError = $derived(!!error);
	const activeColor = $derived(showError ? 'var(--ui-error, #b3261e)' : 'var(--ui-primary, #6750a4)');
	const outlineColor = $derived(showError ? 'var(--ui-error, #b3261e)' : focused ? 'var(--ui-primary, #6750a4)' : 'var(--ui-outline, #79747e)');
	const indicatorClass = $derived(focused ? 'w-full' : 'w-0 left-1/2 -translate-x-1/2');
	const labelClass = $derived(cn(
		'pointer-events-none absolute left-4 transition-all duration-200',
		isFloated ? 'top-0.5 text-sm' : (variant === 'filled' ? 'top-3' : 'top-3.5') + ' text-base',
		showError ? 'text-[var(--ui-error, #b3261e)]' : focused ? 'text-[var(--ui-primary, #6750a4)]' : 'text-[var(--ui-on-surface-variant, #49454f)]',
		variant === 'outlined' ? 'bg-[var(--ui-surface, #fef7ff)] px-1' : ''
	));
</script>

<div
	class={cn(
		'relative inline-flex w-full flex-col',
		disabled && 'pointer-events-none opacity-38',
		className
	)}
>
	{#if variant === 'filled'}
		<!-- Filled variant: surface container + active indicator -->
		<div class="relative rounded-t-lg bg-[var(--ui-surface-container-high, #e7e0ec)]">
			<!-- State layer -->
			<span
				class="pointer-events-none absolute inset-0 rounded-t-lg bg-[var(--ui-on-surface, #1d1b20)] transition-opacity duration-200"
				class:opacity-0={!focused}
				class:opacity-[0.08]={focused}
				aria-hidden="true"
			></span>

			<!-- Active indicator (bottom line) -->
			<span
				class={cn(
					'absolute bottom-0 left-0 h-[2px] transition-all duration-200',
					indicatorClass
				)}
				style:background-color={activeColor}
				aria-hidden="true"
			></span>

			<!-- Content wrapper -->
			<div class="relative flex items-center px-4 pt-2 pb-2">
				<input
					bind:value
					id={inputId}
					{type}
					{placeholder}
					{disabled}
					class="w-full bg-transparent pt-4 pb-2 text-base text-[var(--ui-on-surface, #1d1b20)] outline-none placeholder-transparent"
					onfocus={() => (focused = true)}
					onblur={() => (focused = false)}
					aria-invalid={showError}
					aria-describedby={showError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
					{...restProps}
				/>

				<!-- Floating label -->
				{#if label}
					<label for={inputId} class={labelClass}>
						{label}
					</label>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Outlined variant: full border outline -->
		<div
			class="relative rounded-lg border-2 transition-colors duration-200"
			style:border-color={outlineColor}
		>
			<!-- State layer -->
			<span
				class="pointer-events-none absolute inset-0 rounded-lg bg-[var(--ui-on-surface, #1d1b20)] transition-opacity duration-200"
				class:opacity-0={!focused}
				class:opacity-[0.08]={focused}
				aria-hidden="true"
			></span>

			<!-- Content wrapper -->
			<div class="relative flex items-center px-4">
				<input
					bind:value
					id={inputId}
					{type}
					{placeholder}
					{disabled}
					class="w-full bg-transparent py-3.5 text-base text-[var(--ui-on-surface, #1d1b20)] outline-none placeholder-transparent"
					onfocus={() => (focused = true)}
					onblur={() => (focused = false)}
					aria-invalid={showError}
					aria-describedby={showError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
					{...restProps}
				/>

				<!-- Floating label -->
				{#if label}
					<label for={inputId} class={labelClass}>
						{label}
					</label>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Helper / error text -->
	{#if showError && error}
		<p id="{inputId}-error" class="mt-1 px-4 text-xs text-[var(--ui-error, #b3261e)]" role="alert">
			{error}
		</p>
	{:else if helperText}
		<p id="{inputId}-helper" class="mt-1 px-4 text-xs text-[var(--ui-on-surface-variant, #49454f)]">
			{helperText}
		</p>
	{/if}
</div>

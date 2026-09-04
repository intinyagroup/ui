<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { cn } from '../../utils.js';
	import { formatDate, getLocale } from '../../i18n/index.js';
	import type { HTMLAttributes } from 'svelte/elements';

	interface CalendarDay {
		date: Date;
		iso: string;
		inMonth: boolean;
	}

	let {
		value = $bindable(null),
		month = $bindable(new Date().getMonth()),
		year = $bindable(new Date().getFullYear()),
		min,
		max,
		onDayClick,
		class: className,
		...restProps
	}: {
		value?: string | null;
		month?: number;
		year?: number;
		min?: string;
		max?: string;
		onDayClick?: (date: string) => void;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();

	// --- Helpers -------------------------------------------------------------

	function toISODate(date: Date): string {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}

	function parseISO(iso: string | undefined | null): Date | null {
		if (!iso) return null;
		const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
		if (!match) return null;
		const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
		// Guard against overflow like 2024-02-31 rolling into March.
		if (
			date.getFullYear() !== Number(match[1]) ||
			date.getMonth() !== Number(match[2]) - 1 ||
			date.getDate() !== Number(match[3])
		) {
			return null;
		}
		return date;
	}

	function isSameDay(a: Date, b: Date): boolean {
		return (
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	function today(): Date {
		return new Date();
	}

	// --- Derived state ---------------------------------------------------------

	const selected = $derived(parseISO(value));
	const minDate = $derived(parseISO(min));
	const maxDate = $derived(parseISO(max));

	const weekdayFormatter = $derived(
		new Intl.DateTimeFormat(getLocale().locale, { weekday: 'short' })
	);

	const weekStart = $derived(getLocale().weekStartsOn ?? 0);

	const weekdayHeaders = $derived.by(() => {
		// Anchor the header row to the locale's first weekday (weekStart) so
		// labels stay aligned with the grid regardless of locale week start.
		const firstWeekday = new Date(year, month, 1).getDay();
		return Array.from({ length: 7 }, (_, i) =>
			weekdayFormatter.format(
				new Date(year, month, 1 + ((weekStart + i - firstWeekday + 7) % 7))
			)
		);
	});

	const days = $derived.by(() => {
		const first = new Date(year, month, 1);
		const firstWeekday = first.getDay();
		const leading = (firstWeekday + 7 - weekStart) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const result: CalendarDay[] = [];

		// Leading days from the previous month (dimmed).
		for (let i = 0; i < leading; i++) {
			const date = new Date(year, month, i - leading + 1);
			result.push({ date, iso: toISODate(date), inMonth: false });
		}

		// Current month days.
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);
			result.push({ date, iso: toISODate(date), inMonth: true });
		}

		// Trailing days from the next month (dimmed), padded to a stable
		// 6-week grid so the calendar height doesn't jump between months.
		const total = result.length;
		for (let i = 1; i <= 42 - total; i++) {
			const date = new Date(year, month, daysInMonth + i);
			result.push({ date, iso: toISODate(date), inMonth: false });
		}

		return result;
	});

	const label = $derived(
		formatDate(new Date(year, month, 1), { month: 'long', year: 'numeric' })
	);

	// --- State -----------------------------------------------------------------

	// Keyboard focus cell, tracked independently from `value` so the user can
	// move around with arrows before committing with Enter.
	let focusedISO = $state(value ?? toISODate(today()));

	// --- Per-day predicates -----------------------------------------------------

	function isDisabled(day: CalendarDay): boolean {
		if (minDate && day.date < minDate) return true;
		if (maxDate && day.date > maxDate) return true;
		return false;
	}

	// --- Actions ---------------------------------------------------------------

	function selectDay(day: CalendarDay) {
		if (isDisabled(day)) return;
		value = day.iso;
		focusedISO = day.iso;
		onDayClick?.(day.iso);
	}

	function moveMonth(delta: number) {
		const date = new Date(year, month + delta, 1);
		year = date.getFullYear();
		month = date.getMonth();
		// Keep the focused cell inside the newly visible month, clamped to its
		// day count (e.g. Jan 31 -> Feb 28).
		const parsed = parseISO(focusedISO);
		if (parsed) {
			const daysInTarget = new Date(year, month + 1, 0).getDate();
			focusedISO = toISODate(new Date(year, month, Math.min(parsed.getDate(), daysInTarget)));
		}
	}

	function moveFocus(delta: number) {
		const parsed = parseISO(focusedISO);
		if (!parsed) return;
		const target = new Date(parsed);
		target.setDate(parsed.getDate() + delta);
		// Navigate to the month the focused cell lands in.
		if (target.getMonth() !== month || target.getFullYear() !== year) {
			month = target.getMonth();
			year = target.getFullYear();
		}
		focusedISO = toISODate(target);
	}

	function commitFocus() {
		const parsed = parseISO(focusedISO);
		if (!parsed) return;
		const day: CalendarDay = { date: parsed, iso: focusedISO, inMonth: true };
		if (isDisabled(day)) return;
		value = focusedISO;
		onDayClick?.(focusedISO);
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				moveFocus(-1);
				break;
			case 'ArrowRight':
				event.preventDefault();
				moveFocus(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				moveFocus(-7);
				break;
			case 'ArrowDown':
				event.preventDefault();
				moveFocus(7);
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				commitFocus();
				break;
			case 'Escape':
				event.preventDefault();
				// Reset navigation focus to the selected day (or today).
				focusedISO = value ?? toISODate(today());
				break;
		}
	}
</script>

<div
	class={cn('w-full max-w-sm select-none rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm', className)}
	role="grid"
	aria-label={label}
	tabindex="0"
	onkeydown={handleKeydown}
	{...restProps}
>
	<div class="mb-4 flex items-center justify-between">
		<button
			type="button"
			class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
			onclick={() => moveMonth(-1)}
			aria-label="Previous month"
			tabindex="-1"
		>
			<ChevronLeft class="size-4" />
		</button>
		<div class="text-sm font-medium" aria-live="polite">{label}</div>
		<button
			type="button"
			class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
			onclick={() => moveMonth(1)}
			aria-label="Next month"
			tabindex="-1"
		>
			<ChevronRight class="size-4" />
		</button>
	</div>

	<div class="grid grid-cols-7 gap-1 text-center" role="row">
		{#each weekdayHeaders as header, i (i)}
			<div class="py-1 text-xs font-medium text-muted-foreground" role="columnheader">{header}</div>
		{/each}

		{#each days as day (day.iso)}
			{@const disabled = isDisabled(day)}
			{@const isSelected = selected !== null && isSameDay(day.date, selected)}
			{@const isToday = isSameDay(day.date, today())}
			{@const isFocused = day.iso === focusedISO}
			<button
				type="button"
				class={cn(
					'relative inline-flex size-9 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
					day.inMonth ? 'text-foreground' : 'text-muted-foreground/50',
					isToday && 'font-semibold',
					isSelected && 'bg-primary font-semibold text-primary-foreground hover:bg-primary hover:text-primary-foreground',
					!isSelected && 'hover:bg-accent hover:text-accent-foreground',
					isFocused && !isSelected && 'ring-2 ring-ring',
					disabled && 'pointer-events-none opacity-40'
				)}
				onclick={() => selectDay(day)}
				tabindex="-1"
				disabled={disabled}
				aria-label={day.iso}
				aria-current={isToday ? 'date' : undefined}
			>
				{day.date.getDate()}
				{#if isToday}
					<span
						class="pointer-events-none absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full {isSelected
							? 'bg-primary-foreground'
							: 'bg-primary'}"
					></span>
				{/if}
			</button>
		{/each}
	</div>
</div>

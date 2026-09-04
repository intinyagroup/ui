<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		/** Time value in HH:MM format (bindable) */
		value?: string;
		/** Time format */
		format?: '12h' | '24h';
		/** Additional CSS classes */
		class?: string;
		/** Callback when value changes */
		onchange?: (time: string) => void;
	}

	let {
		value = $bindable('12:00'),
		format = '24h',
		class: className,
		onchange
	}: Props = $props();

	type ClockMode = 'hours' | 'minutes';
	type InputMode = 'clock' | 'keyboard';

	let mode = $state<ClockMode>('hours');
	let inputMode = $state<InputMode>('clock');
	let period = $state<'AM' | 'PM'>('AM');
	let isAnimating = $state(false);

	// Parse initial value
	const parsed = $derived(() => {
		const [h, m] = value.split(':').map(Number);
		return { hours: isNaN(h) ? 12 : h, minutes: isNaN(m) ? 0 : m };
	});

	// Working values for the clock
	let workingHours = $state(12);
	let workingMinutes = $state(0);

	// Initialize working values from value prop
	$effect(() => {
		const { hours, minutes } = parsed();
		workingHours = hours;
		workingMinutes = minutes;
		if (format === '12h') {
			period = hours >= 12 ? 'PM' : 'AM';
		}
	});

	// Clock face numbers
	const hourNumbers = $derived(format === '24h'
		? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0]
		: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	);

	const minuteNumbers = $derived(
		[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
	);

	// Get angle for a number on the clock
	function getAngle(index: number, total: number): number {
		return (index * 360) / total - 90;
	}

	// Get position on clock face
	function getClockPosition(angle: number, radius: number): { x: number; y: number } {
		const rad = (angle * Math.PI) / 180;
		return {
			x: 100 + radius * Math.cos(rad),
			y: 100 + radius * Math.sin(rad)
		};
	}

	// Selected number index
	const selectedIndex = $derived(() => {
		if (mode === 'hours') {
			return hourNumbers.indexOf(workingHours);
		}
		return minuteNumbers.indexOf(workingMinutes);
	});

	// Hand angle
	const handAngle = $derived(() => {
		const idx = selectedIndex();
		if (mode === 'hours') {
			return getAngle(idx, hourNumbers.length);
		}
		return getAngle(idx, minuteNumbers.length);
	});

	// Handle clock number click
	function handleNumberClick(num: number) {
		isAnimating = true;
		setTimeout(() => isAnimating = false, 200);

		if (mode === 'hours') {
			workingHours = num;
			// Auto-switch to minutes
			setTimeout(() => { mode = 'minutes'; }, 300);
		} else {
			workingMinutes = num;
			// Commit value
			commitValue(workingHours, workingMinutes);
		}
	}

	// Commit value
	function commitValue(hours: number, minutes: number) {
		let finalHours = hours;
		if (format === '12h') {
			// Convert 12h to 24h for storage
			if (period === 'PM' && hours < 12) finalHours = hours + 12;
			if (period === 'AM' && hours === 12) finalHours = 0;
		}
		const newTime = `${String(finalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
		value = newTime;
		onchange?.(newTime);
	}

	// Toggle AM/PM
	function togglePeriod(p: 'AM' | 'PM') {
		period = p;
		commitValue(workingHours, workingMinutes);
	}

	// Switch to hours mode
	function switchToHours() {
		mode = 'hours';
	}

	// Switch to minutes mode
	function switchToMinutes() {
		mode = 'minutes';
	}

	// Keyboard input
	let keyboardValue = $state('');

	function handleKeyboardInput(e: KeyboardEvent) {
		const key = e.key;
		if (key >= '0' && key <= '9') {
			if (keyboardValue.length < 4) {
				keyboardValue += key;
			}
		} else if (key === 'Backspace') {
			keyboardValue = keyboardValue.slice(0, -1);
		} else if (key === 'Enter') {
			commitKeyboardValue();
		} else if (key === 'Escape') {
			inputMode = 'clock';
		}
	}

	function commitKeyboardValue() {
		// Parse HH:MM from keyboard input
		if (keyboardValue.length === 4) {
			const hours = parseInt(keyboardValue.slice(0, 2));
			const minutes = parseInt(keyboardValue.slice(2, 4));
			if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
				workingHours = format === '12h' ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours) : hours;
				workingMinutes = minutes;
				if (format === '12h') {
					period = hours >= 12 ? 'PM' : 'AM';
				}
				commitValue(workingHours, workingMinutes);
				inputMode = 'clock';
			}
		}
		keyboardValue = '';
	}

	// Keyboard input focus
	let keyboardInput = $state<HTMLInputElement>();

	$effect(() => {
		if (inputMode === 'keyboard' && keyboardInput) {
			keyboardInput.focus();
		}
	});

	// Handle keyboard mode toggle
	function toggleInputMode() {
		inputMode = inputMode === 'clock' ? 'keyboard' : 'clock';
		if (inputMode === 'keyboard') {
			keyboardValue = '';
		}
	}

	// Check if a number is selected
	function isSelected(num: number): boolean {
		if (mode === 'hours') {
			return workingHours === num;
		}
		return workingMinutes === num;
	}

	// Get display number for 24h mode inner ring
	function isOuterRing(num: number): boolean {
		return format === '24h' && (num >= 13 || num === 0);
	}
</script>

<div
	class={cn(
		'flex flex-col items-center gap-4 p-4 rounded-3xl',
		'bg-[var(--ui-surface-container-high, var(--ui-card))]',
		'shadow-[var(--ui-shadow-lg)]',
		'min-w-[300px]',
		className
	)}
	role="dialog"
	aria-label="Time picker"
>
	<!-- Header: Mode display & Keyboard toggle -->
	<div class="flex items-center justify-between w-full px-2">
		<div class="flex items-center gap-1">
			<button
				class={cn(
					'px-3 py-1 rounded-full text-lg font-medium transition-all duration-200',
					mode === 'hours'
						? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]'
						: 'text-[var(--ui-on-surface-variant)] hover:bg-[var(--ui-on-surface)]/8'
				)}
				onclick={switchToHours}
				aria-label="Select hours"
			>
				{String(workingHours).padStart(2, '0')}
			</button>
			<span class="text-lg font-medium text-[var(--ui-on-surface-variant)]">:</span>
			<button
				class={cn(
					'px-3 py-1 rounded-full text-lg font-medium transition-all duration-200',
					mode === 'minutes'
						? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]'
						: 'text-[var(--ui-on-surface-variant)] hover:bg-[var(--ui-on-surface)]/8'
				)}
				onclick={switchToMinutes}
				aria-label="Select minutes"
			>
				{String(workingMinutes).padStart(2, '0')}
			</button>
		</div>

		<!-- Keyboard input toggle -->
		<button
			class={cn(
				'p-2 rounded-full transition-colors duration-200',
				'text-[var(--ui-on-surface-variant)] hover:bg-[var(--ui-on-surface)]/8'
			)}
			onclick={toggleInputMode}
			aria-label={inputMode === 'clock' ? 'Switch to keyboard input' : 'Switch to clock'}
		>
			{#if inputMode === 'clock'}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
					<path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"/>
					<polyline points="12 6 12 12 16 14"/>
				</svg>
			{/if}
		</button>
	</div>

	{#if inputMode === 'clock'}
		<!-- Clock Face -->
		<div class="relative w-64 h-64 rounded-full bg-[var(--ui-surface-container-lowest, var(--ui-background))]">
			<!-- Clock face background circle -->
			<div class="absolute inset-2 rounded-full bg-[var(--ui-surface-container-low)]"></div>

			<!-- Center dot -->
			<div class="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[var(--ui-primary)] z-20"></div>

			<!-- Hand/pointer -->
			<svg class="absolute inset-0 w-full h-full z-10" viewBox="0 0 200 200">
				<line
					x1="100"
					y1="100"
					x2={getClockPosition(handAngle(), 75).x}
					y2={getClockPosition(handAngle(), 75).y}
					stroke="var(--ui-primary)"
					stroke-width="2"
					stroke-linecap="round"
					class="transition-all duration-200 ease-out"
				/>
				<!-- Small circle at the end of the hand -->
				<circle
					cx={getClockPosition(handAngle(), 75).x}
					cy={getClockPosition(handAngle(), 75).y}
					r="16"
					fill="var(--ui-primary)"
					class="transition-all duration-200 ease-out"
				/>
			</svg>

			<!-- Clock numbers -->
			{#each (mode === 'hours' ? hourNumbers : minuteNumbers) as num, i}
				{@const total = mode === 'hours' ? hourNumbers.length : minuteNumbers.length}
				{@const angle = getAngle(i, total)}
				{@const radius = mode === 'hours' && format === '24h' ? (isOuterRing(num) ? 75 : 55) : 75}
				{@const pos = getClockPosition(angle, radius)}
				<button
					class={cn(
						'absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center',
						'text-sm font-medium transition-all duration-200',
						isSelected(num)
							? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-md scale-110'
							: 'text-[var(--ui-on-surface)] hover:bg-[var(--ui-on-surface)]/8',
						isAnimating && isSelected(num) && 'animate-pulse'
					)}
					style="left: {pos.x}%; top: {pos.y}%;"
					onclick={() => handleNumberClick(num)}
					aria-label={mode === 'hours' ? `${num} hours` : `${num} minutes`}
				>
					{num}
				</button>
			{/each}
		</div>
	{:else}
		<!-- Keyboard Input Mode -->
		<div class="flex flex-col items-center gap-4 py-8 w-full">
			<div class="relative">
				<input
					type="text"
					class={cn(
						'w-48 px-4 py-3 text-center text-2xl font-medium',
						'bg-[var(--ui-surface-container-low)] rounded-xl',
						'border-2 border-[var(--ui-outline)] focus:border-[var(--ui-primary)]',
						'outline-none transition-colors duration-200',
						'text-[var(--ui-on-surface)]'
					)}
					placeholder="HH:MM"
					maxlength={5}
					onkeydown={handleKeyboardInput}
					bind:this={keyboardInput}
					aria-label="Enter time"
				/>
				<!-- Cursor blink indicator -->
				{#if keyboardValue.length > 0}
					<div class="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--ui-primary)] animate-pulse"></div>
				{/if}
			</div>
			<p class="text-sm text-[var(--ui-on-surface-variant)]">
				Type 4 digits (HHMM)
			</p>
		</div>
	{/if}

	<!-- AM/PM Toggle (12h format only) -->
	{#if format === '12h'}
		<div class="flex gap-1 p-1 rounded-full bg-[var(--ui-surface-container-low)]">
			<button
				class={cn(
					'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
					period === 'AM'
						? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-sm'
						: 'text-[var(--ui-on-surface-variant)] hover:bg-[var(--ui-on-surface)]/8'
				)}
				onclick={() => togglePeriod('AM')}
				aria-label="AM"
				aria-pressed={period === 'AM'}
			>
				AM
			</button>
			<button
				class={cn(
					'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
					period === 'PM'
						? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-sm'
						: 'text-[var(--ui-on-surface-variant)] hover:bg-[var(--ui-on-surface)]/8'
				)}
				onclick={() => togglePeriod('PM')}
				aria-label="PM"
				aria-pressed={period === 'PM'}
			>
				PM
			</button>
		</div>
	{/if}
</div>

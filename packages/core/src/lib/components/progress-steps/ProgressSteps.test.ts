import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ProgressSteps from './ProgressSteps.svelte';
import ProgressStepsTest from './ProgressStepsTest.svelte';

describe('ProgressSteps', () => {
	it('renders all step labels', () => {
		render(ProgressSteps, { steps: [{ label: 'Account' }, { label: 'Payment' }], current: 1 });
		expect(screen.getByText('Account')).toBeInTheDocument();
		expect(screen.getByText('Payment')).toBeInTheDocument();
	});

	it('marks the current step with aria-current', () => {
		render(ProgressSteps, { steps: [{ label: 'Account' }, { label: 'Payment' }], current: 1 });
		expect(screen.getByText('Payment')).toBeInTheDocument();
		expect(screen.getByText('2')).toHaveAttribute('aria-current', 'step');
	});

	it('renders completed steps as buttons with a check', () => {
		render(ProgressSteps, {
			steps: [{ label: 'Account' }, { label: 'Payment' }, { label: 'Confirm' }],
			current: 2
		});
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBe(2); // Account and Payment
		expect(screen.getAllByText('✓').length).toBe(2);
	});

	it('renders incomplete future steps as plain text', () => {
		render(ProgressSteps, {
			steps: [{ label: 'Account' }, { label: 'Payment' }, { label: 'Confirm' }],
			current: 1
		});
		// 3 = future (incomplete) step renders its number, not a button
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getAllByRole('button').length).toBe(1);
	});

	it('jumps to a completed step on click', async () => {
		// completed=3 → steps 0,1,2 render as buttons; step 3 (Done) is current
		const { rerender } = render(ProgressSteps, {
			steps: [{ label: 'Account' }, { label: 'Payment' }, { label: 'Confirm' }, { label: 'Done' }],
			current: 3,
			completed: 3
		});
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBe(3);
		await fireEvent.click(buttons[2]); // Confirm
		// current now 2 → Confirm renders with aria-current
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('jumps backwards to the first step', async () => {
		const { rerender } = render(ProgressStepsTest);
		await rerender({ current: 2, completed: 2 });
		await fireEvent.click(screen.getAllByRole('button')[0]);
		expect(screen.getAllByRole('button').length).toBe(1); // only Account completed now
		expect(screen.getByText('Account')).toBeInTheDocument();
	});

	it('does not allow jumping to an uncompleted future step', () => {
		render(ProgressStepsTest);
		// Only Account is completed (button). Confirm/Done are not clickable.
		expect(screen.getAllByRole('button').length).toBe(1);
	});
});

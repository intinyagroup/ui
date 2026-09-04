import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import SegmentedControl from './SegmentedControl.svelte';

const options = [
	{ value: 'all', label: 'All' },
	{ value: 'active', label: 'Active' },
	{ value: 'done', label: 'Done' }
];

describe('SegmentedControl', () => {
	it('renders all options', () => {
		render(SegmentedControl, { value: 'all', options });
		expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Active' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Done' })).toBeInTheDocument();
	});

	it('has tablist and tab roles', () => {
		render(SegmentedControl, { value: 'all', options });
		expect(screen.getByRole('tablist', { name: 'Segmented control' })).toBeInTheDocument();
		expect(screen.getAllByRole('tab').length).toBe(3);
	});

	it('marks the value option as active', () => {
		render(SegmentedControl, { value: 'active', options });
		expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false');
		expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('tabindex', '-1');
	});

	it('applies active styles to the selected option', () => {
		render(SegmentedControl, { value: 'done', options });
		expect(screen.getByRole('tab', { name: 'Done' })).toHaveClass('text-[var(--ui-foreground)]');
		expect(screen.getByRole('tab', { name: 'All' })).toHaveClass('text-[var(--ui-muted-foreground)]');
	});

	it('updates value when an option is clicked', async () => {
		const { component } = render(SegmentedControl, { value: 'all', options });
		await fireEvent.click(screen.getByRole('tab', { name: 'Done' }));
		expect(screen.getByRole('tab', { name: 'Done' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false');
	});

	it('positions the thumb over the active option', () => {
		const { container } = render(SegmentedControl, { value: 'active', options });
		const track = container.querySelector('.relative.flex.h-full');
		expect(track).not.toBeNull();
		expect(container.querySelector('.pointer-events-none.absolute')).not.toBeNull();
	});
});

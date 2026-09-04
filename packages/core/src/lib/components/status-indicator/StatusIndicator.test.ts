import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import StatusIndicator from './StatusIndicator.svelte';

describe('StatusIndicator', () => {
	it('renders online status with label', () => {
		render(StatusIndicator, { status: 'online', label: 'Online' });
		expect(screen.getByText('Online')).toBeInTheDocument();
	});

	it('applies online color class', () => {
		const { container } = render(StatusIndicator, { status: 'online', label: 'Online' });
		expect(container.querySelector('.rounded-full')).toHaveClass('bg-[var(--ui-success)]');
	});

	it('applies offline color class', () => {
		const { container } = render(StatusIndicator, { status: 'offline', label: 'Offline' });
		expect(container.querySelector('.rounded-full')).toHaveClass('bg-[var(--ui-muted-foreground)]/50');
	});

	it('applies away color class', () => {
		const { container } = render(StatusIndicator, { status: 'away', label: 'Away' });
		expect(container.querySelector('.rounded-full')).toHaveClass('bg-[var(--ui-warning)]');
	});

	it('applies busy color class', () => {
		const { container } = render(StatusIndicator, { status: 'busy', label: 'Busy' });
		expect(container.querySelector('.rounded-full')).toHaveClass('bg-[var(--ui-destructive)]');
	});

	it('applies custom color style for custom status', () => {
		const { container } = render(StatusIndicator, { status: 'custom', label: 'Custom', customColor: '#ff00ff' });
		const dot = container.querySelector('.rounded-full');
		expect(dot).toHaveStyle('background-color: #ff00ff');
	});

	it('uses status as aria-label when no label is given', () => {
		render(StatusIndicator, { status: 'busy' });
		expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'busy');
	});

	it('applies size class', () => {
		const { container } = render(StatusIndicator, { status: 'online', size: 'lg' });
		expect(container.querySelector('.rounded-full')).toHaveClass('h-3.5', 'w-3.5');
	});
});

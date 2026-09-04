import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import LiveBadge from './LiveBadge.svelte';

describe('LiveBadge', () => {
	it('renders the LIVE label', () => {
		render(LiveBadge);
		expect(screen.getByText('LIVE')).toBeInTheDocument();
	});

	it('renders a custom label', () => {
		render(LiveBadge, { label: 'ON AIR' });
		expect(screen.getByText('ON AIR')).toBeInTheDocument();
	});

	it('renders the viewers count with a watching suffix', () => {
		render(LiveBadge, { viewers: 128 });
		expect(screen.getByText('128 watching')).toBeInTheDocument();
	});

	it('formats viewers with locale separators', () => {
		render(LiveBadge, { viewers: 12345 });
		expect(screen.getByText('12,345 watching')).toBeInTheDocument();
	});

	it('exposes the live state via role and aria-label', () => {
		render(LiveBadge, { viewers: 7 });
		expect(screen.getByRole('status', { name: 'LIVE, 7 watching' })).toBeInTheDocument();
	});

	it('applies the pulsing ping class by default', () => {
		const { container } = render(LiveBadge);
		expect(container.querySelector('.animate-ping')).not.toBeNull();
	});

	it('disables the pulse when pulsing is false', () => {
		const { container } = render(LiveBadge, { pulsing: false });
		expect(container.querySelector('.animate-ping')).toBeNull();
	});
});

import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import TabBar from './TabBar.svelte';
import TabBarTest from './TabBarTest.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('TabBar', () => {
	it('renders items with labels', () => {
		render(TabBarTest);
		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Search')).toBeInTheDocument();
		expect(screen.getByText('Profile')).toBeInTheDocument();
	});

	it('renders as a navigation landmark with a tablist', () => {
		render(TabBarTest);
		expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
		expect(screen.getByRole('tablist', { name: 'Primary' })).toBeInTheDocument();
	});

	it('marks items with tab role and aria-selected state', () => {
		render(TabBarTest);
		const tabs = screen.getAllByRole('tab');
		expect(tabs.length).toBe(3);
		expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
		expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
		expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
	});

	it('applies active styles to the tab matching the parent value', () => {
		render(TabBarTest);
		const active = screen.getByRole('tab', { name: 'Home' });
		expect(active).toHaveClass('text-[var(--ui-primary)]');
		expect(active).not.toHaveClass('text-[var(--ui-muted-foreground)]');
	});

	it('updates active tab when parent value changes via click', async () => {
		render(TabBarTest);
		expect(screen.getByText('Home').closest('[role="tab"]')).toHaveAttribute('aria-selected', 'true');
		const profileTab = screen.getByText('Profile').closest('[role="tab"]');
		await fireEvent.click(profileTab!);
		expect(profileTab).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByText('Home').closest('[role="tab"]')).toHaveAttribute('aria-selected', 'false');
	});

	it('renders badge count on item', () => {
		render(TabBarTest);
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('caps badge display at 99+', () => {
		render(TabBar, {
			value: 'home',
			children: textSnippet(
				'<button type="button" role="tab" aria-selected="true" class="group relative flex min-h-11">' +
					'<span class="relative flex items-center justify-center">' +
					'<span class="absolute -right-2.5 -top-1 flex min-w-4 items-center justify-center rounded-full bg-[var(--ui-destructive)] px-1 text-[10px] font-semibold leading-4 text-white tabular-nums">99+</span>' +
					'</span>' +
					'<span class="max-w-full truncate text-[11px] font-medium leading-none">Inbox</span>' +
					'</button>'
			)
		});
		expect(screen.getByText('99+')).toBeInTheDocument();
	});

	it('supports the active override prop on items', () => {
		render(TabBar, {
			value: 'home',
			children: textSnippet(
				'<button type="button" role="tab" aria-selected="true" class="text-[var(--ui-primary)]">Forced</button>'
			)
		});
		expect(screen.getByRole('tab', { name: 'Forced' })).toBeInTheDocument();
	});

	it('applies blur class by default and removes it when disabled', async () => {
		const { container, rerender } = render(TabBar, {
			value: 'home',
			blur: true,
			children: textSnippet('<div>nav item</div>')
		});
		expect(container.querySelector('nav')).toHaveClass('supports-[backdrop-filter]:backdrop-blur-xl');
		await rerender({ blur: false });
		expect(container.querySelector('nav')).not.toHaveClass('supports-[backdrop-filter]:backdrop-blur-xl');
	});
});

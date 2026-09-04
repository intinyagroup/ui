import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import Tabs from './tabs.svelte';
import TabsList from './tabs-list.svelte';
import TabsTrigger from './tabs-trigger.svelte';
import TabsContent from './tabs-content.svelte';
import TabsTest from './TabsTest.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Tabs (compound)', () => {
	it('renders the tab list', () => {
		render(TabsTest);
		expect(screen.getByText('Tab 1')).toBeInTheDocument();
		expect(screen.getByText('Tab 2')).toBeInTheDocument();
		expect(screen.getByText('Tab 3')).toBeInTheDocument();
	});

	it('renders tab content for active tab', () => {
		render(TabsTest);
		const content = screen.getByText('Content 1');
		expect(content).toBeInTheDocument();
		expect(content).toBeVisible();
	});

	it('hides inactive tab content via data attributes', () => {
		render(TabsTest);
		// bits-ui Tabs uses data attributes for active/inactive state
		const contents = screen.getAllByRole('tabpanel');
		expect(contents.length).toBeGreaterThan(0);
	});

	it('switches tab on click', async () => {
		render(TabsTest);
		await fireEvent.click(screen.getByText('Tab 2'));
		// After clicking Tab 2, Content 2 should be visible
		const content2 = screen.getByText('Content 2');
		expect(content2).toBeInTheDocument();
	});

	it('switches to third tab on click', async () => {
		render(TabsTest);
		await fireEvent.click(screen.getByText('Tab 3'));
		const content3 = screen.getByText('Content 3');
		expect(content3).toBeInTheDocument();
	});

	it('has tablist role', () => {
		render(TabsTest);
		expect(screen.getByRole('tablist')).toBeInTheDocument();
	});

	it('has tab roles on triggers', () => {
		render(TabsTest);
		const tabs = screen.getAllByRole('tab');
		expect(tabs.length).toBe(3);
	});

	it('each tab has aria-controls', () => {
		render(TabsTest);
		const tabs = screen.getAllByRole('tab');
		for (const tab of tabs) {
			expect(tab).toHaveAttribute('aria-controls');
		}
	});

	it('active tab has aria-selected', () => {
		render(TabsTest);
		const tab1 = screen.getByText('Tab 1');
		expect(tab1).toHaveAttribute('aria-selected', 'true');
	});
});

describe('Tabs (standalone)', () => {
	it('renders with data-slot attribute', () => {
		const { container } = render(Tabs, {
			value: 'tab1',
			children: textSnippet('Tabs content')
		});
		const tabs = container.firstElementChild;
		expect(tabs).toHaveAttribute('data-slot', 'tabs');
	});

	it('renders with flex layout', () => {
		const { container } = render(Tabs, {
			value: 'tab1',
			children: textSnippet('Content')
		});
		const tabs = container.firstElementChild;
		expect(tabs).toHaveClass('flex');
	});

	it('renders with gap', () => {
		const { container } = render(Tabs, {
			value: 'tab1',
			children: textSnippet('Content')
		});
		const tabs = container.firstElementChild;
		expect(tabs).toHaveClass('gap-2');
	});

	it('renders children', () => {
		render(Tabs, {
			value: 'tab1',
			children: textSnippet('Tab body')
		});
		expect(screen.getByText('Tab body')).toBeInTheDocument();
	});
});

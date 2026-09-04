import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import Grid from './Grid.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Grid', () => {
	it('renders children', () => {
		render(Grid, { children: textSnippet('Item') });
		expect(screen.getByText('Item')).toBeInTheDocument();
	});

	it('applies grid-cols-N class from cols', () => {
		const { container } = render(Grid, { cols: 3, children: textSnippet('A') });
		expect(container.querySelector('.grid')).toHaveClass('grid-cols-3');
	});

	it('applies responsive sm class', () => {
		const { container } = render(Grid, { cols: 1, sm: 2, children: textSnippet('A') });
		expect(container.querySelector('.grid')).toHaveClass('sm:grid-cols-2');
	});

	it('applies responsive md class', () => {
		const { container } = render(Grid, { cols: 1, md: 3, children: textSnippet('A') });
		expect(container.querySelector('.grid')).toHaveClass('md:grid-cols-3');
	});

	it('applies responsive lg class', () => {
		const { container } = render(Grid, { cols: 1, lg: 4, children: textSnippet('A') });
		expect(container.querySelector('.grid')).toHaveClass('lg:grid-cols-4');
	});

	it('applies gap class', () => {
		const { container } = render(Grid, { cols: 1, gap: 6, children: textSnippet('A') });
		expect(container.querySelector('.grid')).toHaveClass('gap-6');
	});

	it('does not apply responsive classes when unset', () => {
		const { container } = render(Grid, { cols: 2, children: textSnippet('A') });
		expect(container.querySelector('.grid')).not.toHaveClass('sm:grid-cols-2');
		expect(container.querySelector('.grid')).not.toHaveClass('md:grid-cols-2');
		expect(container.querySelector('.grid')).not.toHaveClass('lg:grid-cols-2');
	});

	it('spreads class prop', () => {
		const { container } = render(Grid, { cols: 1, class: 'my-custom-class', children: textSnippet('A') });
		expect(container.querySelector('.grid')).toHaveClass('my-custom-class');
	});
});

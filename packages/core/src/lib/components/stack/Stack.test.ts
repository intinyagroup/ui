import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import Stack from './Stack.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Stack', () => {
	it('renders children', () => {
		render(Stack, { children: textSnippet('Item') });
		expect(screen.getByText('Item')).toBeInTheDocument();
	});

	it('applies default gap class', () => {
		const { container } = render(Stack, { children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('gap-4');
	});

	it('applies custom gap class', () => {
		const { container } = render(Stack, { gap: 2, children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('gap-2');
	});

	it('adds divide-y class when divider is set', () => {
		const { container } = render(Stack, { divider: true, children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('divide-y');
	});

	it('does not add divide-y class by default', () => {
		const { container } = render(Stack, { children: textSnippet('A') });
		expect(container.querySelector('.flex')).not.toHaveClass('divide-y');
	});

	it('spreads class prop', () => {
		const { container } = render(Stack, { class: 'my-custom-class', children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('my-custom-class');
	});
});

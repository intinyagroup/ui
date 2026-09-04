import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import Flex from './Flex.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Flex', () => {
	it('renders children', () => {
		render(Flex, { children: textSnippet('Item') });
		expect(screen.getByText('Item')).toBeInTheDocument();
	});

	it('applies flex-col class for direction col', () => {
		const { container } = render(Flex, { direction: 'col', children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('flex-col');
	});

	it('does not apply flex-col for direction row', () => {
		const { container } = render(Flex, { direction: 'row', children: textSnippet('A') });
		expect(container.querySelector('.flex')).not.toHaveClass('flex-col');
	});

	it('applies align class', () => {
		const { container } = render(Flex, { align: 'center', children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('items-center');
	});

	it('applies justify class', () => {
		const { container } = render(Flex, { justify: 'between', children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('justify-between');
	});

	it('applies gap class', () => {
		const { container } = render(Flex, { gap: 4, children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('gap-4');
	});

	it('applies flex-wrap when wrap is set', () => {
		const { container } = render(Flex, { wrap: true, children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('flex-wrap');
	});

	it('spreads class prop', () => {
		const { container } = render(Flex, { class: 'my-custom-class', children: textSnippet('A') });
		expect(container.querySelector('.flex')).toHaveClass('my-custom-class');
	});
});

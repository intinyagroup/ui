import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import Card from './Card.svelte';
import CardHeader from './CardHeader.svelte';
import CardTitle from './CardTitle.svelte';
import CardDescription from './CardDescription.svelte';
import CardContent from './CardContent.svelte';
import CardFooter from './CardFooter.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Card', () => {
	it('renders children', () => {
		render(Card, { children: textSnippet('Card content') });
		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('renders as an article element', () => {
		render(Card, { children: textSnippet('Content') });
		const card = screen.getByText('Content');
		expect(card.tagName).toBe('ARTICLE');
	});

	it('renders with class', () => {
		const { container } = render(Card, { class: 'custom', children: textSnippet('Test') });
		expect(container.firstElementChild).toHaveClass('custom');
	});

	it('renders with default card styling', () => {
		render(Card, { children: textSnippet('Styled') });
		const card = screen.getByText('Styled');
		expect(card).toHaveClass('rounded-xl');
		expect(card).toHaveClass('border');
		expect(card).toHaveClass('shadow-sm');
	});
});

describe('CardHeader', () => {
	it('renders children', () => {
		render(CardHeader, { children: textSnippet('Header content') });
		expect(screen.getByText('Header content')).toBeInTheDocument();
	});

	it('renders as a header element', () => {
		render(CardHeader, { children: textSnippet('Header') });
		expect(screen.getByText('Header').tagName).toBe('HEADER');
	});

	it('renders with default styling', () => {
		render(CardHeader, { children: textSnippet('Header') });
		const header = screen.getByText('Header');
		expect(header).toHaveClass('flex');
		expect(header).toHaveClass('flex-col');
		expect(header).toHaveClass('space-y-1.5');
	});
});

describe('CardTitle', () => {
	it('renders as an h3 element', () => {
		const { container } = render(CardTitle, {});
		const h3 = container.querySelector('h3');
		expect(h3).toBeInTheDocument();
		expect(h3.tagName).toBe('H3');
	});

	it('renders with default styling', () => {
		const { container } = render(CardTitle, {});
		const h3 = container.querySelector('h3');
		expect(h3).toHaveClass('text-2xl');
		expect(h3).toHaveClass('font-semibold');
		expect(h3).toHaveClass('leading-none');
		expect(h3).toHaveClass('tracking-tight');
	});

	it('accepts custom class', () => {
		const { container } = render(CardTitle, { class: 'my-title' });
		const h3 = container.querySelector('h3');
		expect(h3).toHaveClass('my-title');
	});
});

describe('CardDescription', () => {
	it('renders as a paragraph element', () => {
		const { container } = render(CardDescription, {});
		const p = container.querySelector('p');
		expect(p).toBeInTheDocument();
		expect(p.tagName).toBe('P');
	});

	it('renders with default styling', () => {
		const { container } = render(CardDescription, {});
		const p = container.querySelector('p');
		expect(p).toHaveClass('text-sm');
		expect(p).toHaveClass('text-[var(--ui-muted-foreground)]');
	});

	it('accepts custom class', () => {
		const { container } = render(CardDescription, { class: 'my-desc' });
		const p = container.querySelector('p');
		expect(p).toHaveClass('my-desc');
	});
});

describe('CardContent', () => {
	it('renders children', () => {
		render(CardContent, { children: textSnippet('Content area') });
		expect(screen.getByText('Content area')).toBeInTheDocument();
	});

	it('renders with padding', () => {
		render(CardContent, { children: textSnippet('Content') });
		const content = screen.getByText('Content');
		expect(content).toHaveClass('p-6');
	});
});

describe('CardFooter', () => {
	it('renders children', () => {
		render(CardFooter, { children: textSnippet('Footer content') });
		expect(screen.getByText('Footer content')).toBeInTheDocument();
	});

	it('renders as a footer element', () => {
		render(CardFooter, { children: textSnippet('Footer') });
		expect(screen.getByText('Footer').tagName).toBe('FOOTER');
	});

	it('renders with flex layout', () => {
		render(CardFooter, { children: textSnippet('Footer') });
		const footer = screen.getByText('Footer');
		expect(footer).toHaveClass('flex');
		expect(footer).toHaveClass('items-center');
	});
});

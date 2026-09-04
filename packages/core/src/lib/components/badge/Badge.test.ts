import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import Badge from './badge.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Badge', () => {
	it('renders with text', () => {
		render(Badge, { children: textSnippet('Badge') });
		expect(screen.getByText('Badge')).toBeInTheDocument();
	});

	it('renders as a span by default', () => {
		render(Badge, { children: textSnippet('Badge') });
		const badge = screen.getByText('Badge');
		expect(badge.tagName).toBe('SPAN');
	});

	it('renders as a link when href is provided', () => {
		render(Badge, { href: '/link', children: textSnippet('Linked') });
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/link');
		expect(link).toHaveTextContent('Linked');
	});

	it('renders with default variant', () => {
		render(Badge, { children: textSnippet('Default') });
		const badge = screen.getByText('Default');
		expect(badge).toHaveClass('bg-primary');
	});

	it('renders with secondary variant', () => {
		render(Badge, { variant: 'secondary', children: textSnippet('Secondary') });
		const badge = screen.getByText('Secondary');
		expect(badge).toHaveClass('bg-secondary');
	});

	it('renders with destructive variant', () => {
		render(Badge, { variant: 'destructive', children: textSnippet('Error') });
		const badge = screen.getByText('Error');
		expect(badge).toHaveClass('bg-destructive/10');
	});

	it('renders with outline variant', () => {
		render(Badge, { variant: 'outline', children: textSnippet('Outline') });
		const badge = screen.getByText('Outline');
		expect(badge).toHaveClass('border-border');
	});

	it('renders with ghost variant', () => {
		render(Badge, { variant: 'ghost', children: textSnippet('Ghost') });
		const badge = screen.getByText('Ghost');
		expect(badge).toHaveClass('hover:bg-muted');
	});

	it('renders with link variant', () => {
		render(Badge, { variant: 'link', children: textSnippet('Link') });
		const badge = screen.getByText('Link');
		expect(badge).toHaveClass('underline-offset-4');
	});

	it('renders with custom class', () => {
		render(Badge, { class: 'custom-badge', children: textSnippet('Custom') });
		const badge = screen.getByText('Custom');
		expect(badge).toHaveClass('custom-badge');
	});

	it('renders with data-slot attribute', () => {
		render(Badge, { children: textSnippet('Slot') });
		expect(screen.getByText('Slot')).toHaveAttribute('data-slot', 'badge');
	});

	it('renders inline-flex layout', () => {
		render(Badge, { children: textSnippet('Inline') });
		const badge = screen.getByText('Inline');
		expect(badge).toHaveClass('inline-flex');
	});

	it('renders as small text', () => {
		render(Badge, { children: textSnippet('Small') });
		const badge = screen.getByText('Small');
		expect(badge).toHaveClass('text-xs');
	});

	it('renders rounded pill shape', () => {
		render(Badge, { children: textSnippet('Pill') });
		const badge = screen.getByText('Pill');
		expect(badge).toHaveClass('rounded-4xl');
	});
});

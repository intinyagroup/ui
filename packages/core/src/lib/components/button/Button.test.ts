import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import Button from './Button.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Button', () => {
	it('renders with text', () => {
		render(Button, { children: textSnippet('Click me') });
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('renders as a button element by default', () => {
		render(Button, { children: textSnippet('Click') });
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('renders with variant', () => {
		render(Button, { variant: 'secondary', children: textSnippet('Secondary') });
		const btn = screen.getByText('Secondary');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveClass('bg-secondary');
	});

	it('renders with outline variant', () => {
		render(Button, { variant: 'outline', children: textSnippet('Outline') });
		const btn = screen.getByText('Outline');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveClass('border-border');
	});

	it('renders with ghost variant', () => {
		render(Button, { variant: 'ghost', children: textSnippet('Ghost') });
		const btn = screen.getByText('Ghost');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveClass('hover:bg-muted');
	});

	it('renders with destructive variant', () => {
		render(Button, { variant: 'destructive', children: textSnippet('Delete') });
		const btn = screen.getByText('Delete');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveClass('bg-destructive/10');
	});

	it('handles click event', async () => {
		const onClick = vi.fn();
		render(Button, { onclick: onClick, children: textSnippet('Click') });
		await fireEvent.click(screen.getByText('Click'));
		expect(onClick).toHaveBeenCalled();
	});

	it('renders as disabled', () => {
		render(Button, { disabled: true, children: textSnippet('Disabled') });
		const btn = screen.getByRole('button');
		expect(btn).toBeDisabled();
		expect(btn).toHaveAttribute('disabled');
	});

	it('renders with size default', () => {
		render(Button, { children: textSnippet('Default') });
		const btn = screen.getByText('Default');
		expect(btn).toHaveClass('h-8');
	});

	it('renders with size lg', () => {
		render(Button, { size: 'lg', children: textSnippet('Large') });
		const btn = screen.getByText('Large');
		expect(btn).toHaveClass('h-9');
	});

	it('renders with size sm', () => {
		render(Button, { size: 'sm', children: textSnippet('Small') });
		const btn = screen.getByText('Small');
		expect(btn).toHaveClass('h-7');
	});

	it('renders with size xs', () => {
		render(Button, { size: 'xs', children: textSnippet('Tiny') });
		const btn = screen.getByText('Tiny');
		expect(btn).toHaveClass('h-6');
	});

	it('renders with custom class', () => {
		render(Button, { class: 'my-custom-class', children: textSnippet('Styled') });
		const btn = screen.getByText('Styled');
		expect(btn).toHaveClass('my-custom-class');
	});

	it('renders as a link when href is provided', () => {
		render(Button, { href: '/about', children: textSnippet('About') });
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/about');
		expect(link).toHaveTextContent('About');
	});

	it('renders with data-slot attribute', () => {
		render(Button, { children: textSnippet('Slot') });
		expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
	});

	it('defaults to type="button"', () => {
		render(Button, { children: textSnippet('Type') });
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it('accepts custom type', () => {
		render(Button, { type: 'submit', children: textSnippet('Submit') });
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
	});

	it('renders with link variant', () => {
		render(Button, { variant: 'link', children: textSnippet('Link Style') });
		const btn = screen.getByText('Link Style');
		expect(btn).toHaveClass('underline-offset-4');
	});
});

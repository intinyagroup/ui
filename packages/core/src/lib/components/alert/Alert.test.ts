import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import Alert from './alert.svelte';
import AlertAction from './alert-action.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => text
	}));
}

describe('Alert', () => {
	it('renders with role alert', () => {
		render(Alert, { children: textSnippet('Alert message') });
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('renders children', () => {
		render(Alert, { children: textSnippet('Content') });
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('renders as a div element', () => {
		render(Alert, { children: textSnippet('Content') });
		const alert = screen.getByRole('alert');
		expect(alert.tagName).toBe('DIV');
	});

	it('renders with default variant', () => {
		render(Alert, { children: textSnippet('Default') });
		const alert = screen.getByText('Default');
		expect(alert).toHaveClass('bg-card');
		expect(alert).toHaveClass('text-card-foreground');
	});

	it('renders with destructive variant', () => {
		render(Alert, { variant: 'destructive', children: textSnippet('Error') });
		const alert = screen.getByText('Error');
		expect(alert).toHaveClass('bg-card');
		expect(alert).toHaveClass('text-destructive');
	});

	it('renders with custom class', () => {
		render(Alert, { class: 'custom-alert', children: textSnippet('Custom') });
		const alert = screen.getByText('Custom');
		expect(alert).toHaveClass('custom-alert');
	});

	it('renders with data-slot attribute', () => {
		render(Alert, { children: textSnippet('Slot') });
		expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert');
	});

	it('renders with default border and rounded styling', () => {
		render(Alert, { children: textSnippet('Styled') });
		const alert = screen.getByText('Styled');
		expect(alert).toHaveClass('border');
		expect(alert).toHaveClass('rounded-lg');
	});

	it('renders with grid layout', () => {
		render(Alert, { children: textSnippet('Grid') });
		const alert = screen.getByText('Grid');
		expect(alert).toHaveClass('grid');
	});

	it('renders full width', () => {
		render(Alert, { children: textSnippet('Wide') });
		const alert = screen.getByText('Wide');
		expect(alert).toHaveClass('w-full');
	});

	it('has proper aria-labelledby', () => {
		render(Alert, { children: textSnippet('Aria') });
		const alert = screen.getByRole('alert');
		const labelledBy = alert.getAttribute('aria-labelledby');
		expect(labelledBy).toBeTruthy();
		expect(labelledBy).toMatch(/^alert-title-/);
	});

	it('has proper aria-describedby', () => {
		render(Alert, { children: textSnippet('Aria') });
		const alert = screen.getByRole('alert');
		const describedBy = alert.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		expect(describedBy).toMatch(/^alert-desc-/);
	});

	it('renders with text-sm base class', () => {
		render(Alert, { children: textSnippet('Small text') });
		const alert = screen.getByText('Small text');
		expect(alert).toHaveClass('text-sm');
	});

	it('renders with left-aligned text', () => {
		render(Alert, { children: textSnippet('Left') });
		const alert = screen.getByText('Left');
		expect(alert).toHaveClass('text-left');
	});
});

describe('AlertAction', () => {
	it('renders children', () => {
		render(AlertAction, { children: textSnippet('Action') });
		expect(screen.getByText('Action')).toBeInTheDocument();
	});

	it('renders with data-slot attribute', () => {
		render(AlertAction, { children: textSnippet('Action') });
		expect(screen.getByText('Action')).toHaveAttribute('data-slot', 'alert-action');
	});

	it('renders with absolute positioning', () => {
		render(AlertAction, { children: textSnippet('Action') });
		const action = screen.getByText('Action');
		expect(action).toHaveClass('absolute');
		expect(action).toHaveClass('top-2');
		expect(action).toHaveClass('right-2');
	});

	it('renders as a div', () => {
		render(AlertAction, { children: textSnippet('Action') });
		const action = screen.getByText('Action');
		expect(action.tagName).toBe('DIV');
	});
});

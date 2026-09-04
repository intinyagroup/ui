import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Input from './input.svelte';

describe('Input', () => {
	it('renders with placeholder', () => {
		render(Input, { placeholder: 'Enter text' });
		expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
	});

	it('renders as an input element', () => {
		render(Input);
		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('handles value change', async () => {
		const { component } = render(Input);
		const input = screen.getByRole('textbox');
		await fireEvent.input(input, { target: { value: 'test' } });
		expect(input).toHaveValue('test');
	});

	it('renders as disabled', () => {
		render(Input, { disabled: true });
		expect(screen.getByRole('textbox')).toBeDisabled();
	});

	it('has no explicit type attribute by default (browser defaults to text)', () => {
		render(Input);
		const input = screen.getByRole('textbox');
		// When type is not explicitly set, HTML doesn't render the attribute
		expect(input).not.toHaveAttribute('type');
	});

	it('renders with type password', () => {
		render(Input, { type: 'password' });
		const input = document.querySelector('input[type="password"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders with type email', () => {
		render(Input, { type: 'email' });
		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
	});

	it('renders with type number', () => {
		render(Input, { type: 'number' });
		expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
	});

	it('renders with type tel', () => {
		render(Input, { type: 'tel' });
		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
	});

	it('renders with type url', () => {
		render(Input, { type: 'url' });
		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'url');
	});

	it('renders with custom class', () => {
		render(Input, { class: 'custom-input' });
		const input = screen.getByRole('textbox');
		expect(input).toHaveClass('custom-input');
	});

	it('renders with default input styling', () => {
		render(Input);
		const input = screen.getByRole('textbox');
		expect(input).toHaveClass('h-8');
		expect(input).toHaveClass('rounded-lg');
		expect(input).toHaveClass('border');
		expect(input).toHaveClass('w-full');
	});

	it('renders with data-slot attribute', () => {
		render(Input);
		expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input');
	});

	it('renders with value prop', () => {
		render(Input, { value: 'initial' });
		expect(screen.getByRole('textbox')).toHaveValue('initial');
	});

	it('renders as read-only', () => {
		render(Input, { readonly: true });
		expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
	});

	it('renders with aria-invalid', () => {
		render(Input, { 'aria-invalid': true });
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('does not render as disabled when disabled is false', () => {
		render(Input, { disabled: false });
		expect(screen.getByRole('textbox')).not.toBeDisabled();
	});
});

import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FormInput from './FormInput.svelte';
import { validators } from './validate.js';

describe('FormInput', () => {
	it('renders the label', () => {
		render(FormInput, { label: 'Name', id: 'name' });
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('shows no error before blur with failing rules', () => {
		render(FormInput, { label: 'Name', value: '', rules: [validators.required()] });
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('shows error after blur with failing rules', async () => {
		render(FormInput, { label: 'Name', value: '', rules: [validators.required()] });
		const input = screen.getByRole('textbox');
		await fireEvent.blur(input);
		expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
	});

	it('clears error with valid input', async () => {
		render(FormInput, { label: 'Name', value: '', rules: [validators.required()] });
		const input = screen.getByRole('textbox');
		await fireEvent.blur(input);
		expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
		await fireEvent.input(input, { target: { value: 'Ada' } });
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('sets aria-invalid when error is shown', async () => {
		render(FormInput, { label: 'Name', value: '', rules: [validators.required()] });
		const input = screen.getByRole('textbox');
		expect(input).not.toHaveAttribute('aria-invalid');
		await fireEvent.blur(input);
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});
});

import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import EditableLabel from './EditableLabel.svelte';

describe('EditableLabel', () => {
	it('shows value as text', () => {
		render(EditableLabel, { value: 'Hello World' });
		expect(screen.getByText('Hello World')).toBeInTheDocument();
	});

	it('shows placeholder when value is empty', () => {
		render(EditableLabel, { value: '', placeholder: 'Click to edit' });
		expect(screen.getByText('Click to edit')).toBeInTheDocument();
	});

	it('click toggles edit mode and shows input', async () => {
		render(EditableLabel, { value: 'Hello World' });
		await fireEvent.click(screen.getByText('Hello World'));
		const input = screen.getByRole('textbox', { name: 'Edit label' });
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue('Hello World');
	});

	it('Enter commits value and calls onEdit', async () => {
		const onEdit = vi.fn();
		render(EditableLabel, { value: 'Old', onEdit });
		await fireEvent.click(screen.getByText('Old'));
		const input = screen.getByRole('textbox', { name: 'Edit label' });
		await fireEvent.input(input, { target: { value: 'New' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		expect(onEdit).toHaveBeenCalledWith('New');
		expect(screen.getByText('New')).toBeInTheDocument();
	});

	it('does not call onEdit when committed value is unchanged', async () => {
		const onEdit = vi.fn();
		render(EditableLabel, { value: 'Same', onEdit });
		await fireEvent.click(screen.getByText('Same'));
		const input = screen.getByRole('textbox', { name: 'Edit label' });
		await fireEvent.keyDown(input, { key: 'Enter' });
		expect(onEdit).not.toHaveBeenCalled();
	});

	it('Escape cancels and restores original value', async () => {
		const onEdit = vi.fn();
		render(EditableLabel, { value: 'Original', onEdit });
		await fireEvent.click(screen.getByText('Original'));
		const input = screen.getByRole('textbox', { name: 'Edit label' });
		await fireEvent.input(input, { target: { value: 'Changed' } });
		await fireEvent.keyDown(input, { key: 'Escape' });
		expect(onEdit).not.toHaveBeenCalled();
		expect(screen.getByText('Original')).toBeInTheDocument();
		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	});
});

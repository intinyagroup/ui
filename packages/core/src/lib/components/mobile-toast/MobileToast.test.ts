import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import MobileToast from './MobileToast.svelte';

describe('MobileToast', () => {
	it('renders nothing when closed', () => {
		const { container } = render(MobileToast, { message: 'Hello', open: false });
		expect(container.textContent).toBe('');
	});

	it('renders the message when open', () => {
		render(MobileToast, { message: 'Order saved', open: true });
		expect(screen.getByText('Order saved')).toBeInTheDocument();
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('calls onAction and starts leaving when the action button is clicked', async () => {
		const onAction = vi.fn();
		render(MobileToast, { message: 'Update available', open: true, action: 'Update', onAction });
		await fireEvent.click(screen.getByText('Update'));
		expect(onAction).toHaveBeenCalledTimes(1);
	});

	it('does not schedule auto-dismiss when an action is present', () => {
		const ondismiss = vi.fn();
		render(MobileToast, {
			message: 'Action toast',
			open: true,
			action: 'Retry',
			duration: 1000,
			ondismiss
		});
		expect(screen.getByText('Action toast')).toBeInTheDocument();
		expect(ondismiss).not.toHaveBeenCalled();
	});

	it('calls ondismiss when the close button is clicked', async () => {
		const ondismiss = vi.fn();
		render(MobileToast, { message: 'Dismiss me', open: true, ondismiss });
		await fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
		expect(ondismiss).toHaveBeenCalledTimes(1);
	});

	it('applies variant styles', () => {
		const { container } = render(MobileToast, { message: 'Great', open: true, variant: 'success' });
		expect(container.querySelector('.rounded-2xl')).toHaveClass('bg-emerald-600', 'text-white');
	});

	it('positions the toast at the top when requested', () => {
		const { container } = render(MobileToast, { message: 'Up top', open: true, position: 'top' });
		expect(container.querySelector('.fixed')).toHaveClass('top-0');
	});
});

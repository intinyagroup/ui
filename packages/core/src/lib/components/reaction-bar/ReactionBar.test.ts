import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ReactionBar, { type Reaction } from './ReactionBar.svelte';

const reactions: Reaction[] = [
	{ id: 'like', emoji: '👍', count: 12, label: 'Like' },
	{ id: 'love', emoji: '❤️', count: 4, label: 'Love' },
	{ id: 'laugh', emoji: '😂', count: 0, label: 'Laugh' }
];

describe('ReactionBar', () => {
	it('renders reactions with emoji and counts', () => {
		render(ReactionBar, { reactions });
		expect(screen.getByText('👍')).toBeInTheDocument();
		expect(screen.getByText('12')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();
	});

	it('has a group role with an accessible label', () => {
		render(ReactionBar, { reactions });
		expect(screen.getByRole('group', { name: 'Reactions' })).toBeInTheDocument();
	});

	it('calls onReact with the reaction id on click', async () => {
		const onReact = vi.fn();
		render(ReactionBar, { reactions, onReact });
		await fireEvent.click(screen.getByRole('button', { name: 'Like, 12' }));
		expect(onReact).toHaveBeenCalledWith('like');
	});

	it('marks the selected reaction with aria-pressed and emphasis classes', () => {
		render(ReactionBar, { reactions, selected: 'like' });
		const like = screen.getByRole('button', { name: 'Like, 12' });
		expect(like).toHaveAttribute('aria-pressed', 'true');
		expect(like).toHaveClass('border-[var(--ui-primary)]/40', 'bg-[var(--ui-primary)]/10');
		expect(screen.getByRole('button', { name: 'Love, 4' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('deselects when the selected reaction is clicked again', async () => {
		const onReact = vi.fn();
		render(ReactionBar, { reactions, selected: 'like', onReact });
		await fireEvent.click(screen.getByRole('button', { name: 'Like, 12' }));
		expect(onReact).toHaveBeenCalledWith(null);
	});

	it('keeps the selection when allowDeselect is false', async () => {
		const onReact = vi.fn();
		render(ReactionBar, { reactions, selected: 'like', allowDeselect: false, onReact });
		await fireEvent.click(screen.getByRole('button', { name: 'Like, 12' }));
		expect(onReact).toHaveBeenCalledWith('like');
	});

	it('omits the count when it is zero', () => {
		render(ReactionBar, { reactions });
		const laugh = screen.getByRole('button', { name: 'Laugh' });
		expect(laugh).toHaveTextContent('😂');
		expect(laugh).not.toHaveTextContent('0');
	});

	it('uses the label for the accessible name', () => {
		render(ReactionBar, { reactions });
		expect(screen.getByRole('button', { name: 'Laugh' })).toBeInTheDocument();
	});
});

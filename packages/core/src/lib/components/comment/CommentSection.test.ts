import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import CommentSection, { type CommentItem } from './CommentSection.svelte';

const comments: CommentItem[] = [
	{ id: 1, author: 'alice', text: 'First!', time: '2m ago', likes: 5 },
	{ id: 2, author: 'bob', text: 'Nice work', time: '1h ago' },
	{ id: 3, author: 'me', text: 'Thanks everyone', time: '30m ago', likes: 1 }
];

describe('CommentSection', () => {
	it('renders comments with author, text, and time', () => {
		render(CommentSection, { comments });
		expect(screen.getByText('alice')).toBeInTheDocument();
		expect(screen.getByText('First!')).toBeInTheDocument();
		expect(screen.getByText('2m ago')).toBeInTheDocument();
		expect(screen.getByText('bob')).toBeInTheDocument();
		expect(screen.getByText('Nice work')).toBeInTheDocument();
	});

	it('renders the like count when present', () => {
		render(CommentSection, { comments, onLike: vi.fn() });
		const likeButton = screen.getByRole('button', { name: '5 likes' });
		expect(likeButton).toBeInTheDocument();
		expect(likeButton).toHaveTextContent('5 likes');
	});

	it('calls onAddComment with text on submit and clears the input', async () => {
		const onAddComment = vi.fn();
		render(CommentSection, { comments: [], onAddComment });
		const input = screen.getByRole('textbox', { name: 'Add a comment' });
		await fireEvent.input(input, { target: { value: 'A new thought' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Post' }));
		expect(onAddComment).toHaveBeenCalledWith('A new thought');
		expect(input).toHaveValue('');
	});

	it('does not call onAddComment for an empty draft', async () => {
		const onAddComment = vi.fn();
		render(CommentSection, { comments: [], onAddComment });
		await fireEvent.click(screen.getByRole('button', { name: 'Post' }));
		expect(onAddComment).not.toHaveBeenCalled();
	});

	it('calls onLike with the comment id', async () => {
		const onLike = vi.fn();
		render(CommentSection, { comments, onLike });
		await fireEvent.click(screen.getByText('5 likes'));
		expect(onLike).toHaveBeenCalledWith(1);
	});

	it('shows Like label when a comment has no likes', () => {
		render(CommentSection, { comments, onLike: vi.fn() });
		expect(screen.getByText('Like')).toBeInTheDocument();
	});

	it('shows delete button only for the current user', () => {
		render(CommentSection, { comments, currentUser: 'me', onDelete: vi.fn() });
		const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
		expect(deleteButtons.length).toBe(1);
	});

	it('calls onDelete with the comment id', async () => {
		const onDelete = vi.fn();
		render(CommentSection, { comments, currentUser: 'me', onDelete });
		await fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
		expect(onDelete).toHaveBeenCalledWith(3);
	});

	it('does not render delete buttons without a current user', () => {
		render(CommentSection, { comments, onDelete: vi.fn() });
		expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
	});

	it('marks the current user comment with a you chip', () => {
		render(CommentSection, { comments, currentUser: 'me' });
		expect(screen.getByText('you')).toBeInTheDocument();
	});

	it('hides the comment form when onAddComment is not provided', () => {
		render(CommentSection, { comments });
		expect(screen.queryByRole('textbox', { name: 'Add a comment' })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Post' })).not.toBeInTheDocument();
	});
});

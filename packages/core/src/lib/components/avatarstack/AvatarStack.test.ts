import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import AvatarStack from './AvatarStack.svelte';

const srcs = ['/a.png', '/b.png', '/c.png', '/d.png', '/e.png', '/f.png'];

describe('AvatarStack', () => {
	it('renders all avatars when under the max', () => {
		const { container } = render(AvatarStack, { srcs: srcs.slice(0, 3) });
		const images = container.querySelectorAll('img');
		expect(images.length).toBe(3);
		expect(images[0]).toHaveAttribute('src', '/a.png');
		expect(images[0]).toHaveAttribute('alt', '');
	});

	it('truncates avatars beyond max and shows a +N badge', () => {
		const { container } = render(AvatarStack, { srcs, max: 4 });
		expect(container.querySelectorAll('img').length).toBe(4);
		expect(screen.getByText('+2')).toBeInTheDocument();
	});

	it('uses the default max of 5', () => {
		const { container } = render(AvatarStack, { srcs });
		expect(container.querySelectorAll('img').length).toBe(5);
		expect(screen.getByText('+1')).toBeInTheDocument();
	});

	it('announces the visible/total count via aria-label', () => {
		render(AvatarStack, { srcs, max: 4 });
		expect(screen.getByRole('img', { name: '4 of 6 avatars, 2 more' })).toBeInTheDocument();
	});

	it('does not render a badge when all avatars fit', () => {
		render(AvatarStack, { srcs: srcs.slice(0, 2), max: 5 });
		expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
	});

	it('applies size classes', () => {
		const { container } = render(AvatarStack, { srcs: ['/a.png'], size: 'lg' });
		expect(container.querySelector('img')).toHaveClass('h-12', 'w-12');
		const { container: sm } = render(AvatarStack, { srcs: ['/a.png'], size: 'sm' });
		expect(sm.querySelector('img')).toHaveClass('h-7', 'w-7');
	});

	it('overlaps subsequent avatars with negative margin', () => {
		const { container } = render(AvatarStack, { srcs: ['/a.png', '/b.png'] });
		const images = container.querySelectorAll('img');
		expect(images[1]).toHaveClass('-ml-2');
	});
});

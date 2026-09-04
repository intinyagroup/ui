import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ClipboardButton from './ClipboardButton.svelte';

describe('ClipboardButton', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
		delete (document as Document & { execCommand?: unknown }).execCommand;
	});

	it('renders the copy label by default', () => {
		render(ClipboardButton, { text: 'hello' });
		expect(screen.getByText('Copy')).toBeInTheDocument();
	});

	it('calls navigator.clipboard.writeText with text on click', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', { clipboard: { writeText } });
		render(ClipboardButton, { text: 'secret-value' });
		await fireEvent.click(screen.getByRole('button'));
		expect(writeText).toHaveBeenCalledWith('secret-value');
	});

	it('shows copiedLabel after click and calls onCopied', async () => {
		vi.useFakeTimers();
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', { clipboard: { writeText } });
		const onCopied = vi.fn();
		render(ClipboardButton, { text: 'hello', onCopied });
		await fireEvent.click(screen.getByRole('button'));
		expect(screen.getByText('Copied!')).toBeInTheDocument();
		expect(onCopied).toHaveBeenCalledTimes(1);
	});

	it('falls back to execCommand when clipboard is undefined', async () => {
		vi.stubGlobal('navigator', {});
		const execCommand = vi.fn().mockReturnValue(true);
		(document as Document & { execCommand?: unknown }).execCommand = execCommand;
		render(ClipboardButton, { text: 'legacy-value' });
		await fireEvent.click(screen.getByRole('button'));
		expect(execCommand).toHaveBeenCalledWith('copy');
		expect(screen.getByText('Copied!')).toBeInTheDocument();
	});

	it('does not show copied label when execCommand fails', async () => {
		vi.stubGlobal('navigator', {});
		const execCommand = vi.fn().mockReturnValue(false);
		(document as Document & { execCommand?: unknown }).execCommand = execCommand;
		render(ClipboardButton, { text: 'failing' });
		await fireEvent.click(screen.getByRole('button'));
		expect(execCommand).toHaveBeenCalledWith('copy');
		expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
		expect(screen.getByText('Copy')).toBeInTheDocument();
	});
});

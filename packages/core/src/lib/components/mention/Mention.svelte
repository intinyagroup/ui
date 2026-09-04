<script lang="ts">
	import { cn } from '../../utils.js';

	type User = { id: string; name: string; avatar?: string };

	let {
		value = $bindable(''),
		users = $bindable([]),
		placeholder = 'Type @ to mention someone…',
		onMention,
		class: className,
	}: {
		value?: string;
		users?: User[];
		placeholder?: string;
		onMention?: (user: User) => void;
		class?: string;
	} = $props();

	let ref = $state<HTMLDivElement>();
	let query = $state('');
	let activeIndex = $state(0);
	let dropdown = $state({ open: false, top: 0, left: 0 });

	const filtered = $derived(
		query.trim()
			? users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
			: users
	);

	// Keep the DOM in sync with the bound value. We manage content imperatively
	// (no {@html}) so typing never re-renders the editor and kills the caret.
	// When the change originated here, innerHTML already matches and this is a no-op.
	$effect(() => {
		if (ref && ref.innerHTML !== value) {
			ref.innerHTML = value;
		}
	});

	// Listen for caret movement (clicks, arrows, undo…) to keep the dropdown
	// open/closed and repositioned near the caret. `selectionchange` only fires
	// on the document, never on the editor element itself.
	$effect(() => {
		const el = ref;
		if (!el) return;
		const doc = el.ownerDocument;
		const handler = () => {
			if (!el.contains(doc.activeElement)) return;
			const sel = window.getSelection();
			if (!sel || !sel.rangeCount || !el.contains(sel.anchorNode)) return;
			const q = currentQuery();
			if (q !== undefined) {
				openDropdown(q);
			} else {
				closeDropdown();
			}
		};
		doc.addEventListener('selectionchange', handler);
		return () => doc.removeEventListener('selectionchange', handler);
	});

	/** Returns the mention query after the caret ('' for a bare '@', undefined when no mention). */
	function currentQuery(): string | undefined {
		if (!ref) return undefined;
		const sel = window.getSelection();
		if (!sel || !sel.rangeCount) return undefined;
		const range = sel.getRangeAt(0);
		const node = range.startContainer;
		if (node.nodeType !== Node.TEXT_NODE) return undefined;
		const offset = range.startOffset;
		const text = node.textContent ?? '';
		// Only match when the caret sits at the end of the "@query" token.
		const match = /@(\w*)$/.exec(text.slice(0, offset));
		if (!match) return undefined;
		return match[1];
	}

	function caretCoords() {
		const sel = window.getSelection();
		if (sel && sel.rangeCount) {
			const rect = sel.getRangeAt(0).getClientRects()[0];
			if (rect) return rect;
		}
		return null;
	}

	function openDropdown(q: string) {
		query = q;
		activeIndex = 0;
		const rect = caretCoords();
		if (rect && ref) {
			const base = ref.getBoundingClientRect();
			dropdown = { open: true, top: rect.bottom - base.top + 4, left: rect.left - base.left };
		} else {
			dropdown = { open: true, top: 0, left: 0 };
		}
	}

	function closeDropdown() {
		dropdown = { ...dropdown, open: false };
		query = '';
	}

	function handleInput() {
		if (!ref) return;
		value = ref.innerHTML;
		const q = currentQuery();
		if (q !== undefined) {
			openDropdown(q);
		} else {
			closeDropdown();
		}
	}

	function selectUser(user: User) {
		if (!ref) return;
		const sel = window.getSelection();
		if (!sel || !sel.rangeCount) return;

		const range = sel.getRangeAt(0);
		const node = range.startContainer;
		if (node.nodeType === Node.TEXT_NODE) {
			// Replace the "@query" the caret sits at the end of.
			const text = node.textContent ?? '';
			const match = /@(\w+)$/.exec(text.slice(0, range.startOffset));
			if (match) {
				range.setStart(node, range.startOffset - match[0].length);
			}
		}

		range.deleteContents();

		const span = document.createElement('span');
		span.className = 'mention';
		span.contentEditable = 'false';
		span.textContent = '@' + user.name;
		range.insertNode(span);

		// Move the caret just after the mention.
		range.setStartAfter(span);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);

		value = ref.innerHTML;
		closeDropdown();
		onMention?.(user);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!dropdown.open) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % filtered.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const user = filtered[activeIndex];
			if (user) selectUser(user);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			closeDropdown();
		}
	}
</script>

<div class="relative w-full">
	<div
		bind:this={ref}
		contenteditable="true"
		role="textbox"
		tabindex="0"
		aria-multiline="true"
		aria-label={placeholder}
		data-placeholder={placeholder}
		class={cn(
			"min-h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground [&:empty::before]:pointer-events-none [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-muted-foreground [&_.mention]:rounded [&_.mention]:bg-primary/15 [&_.mention]:px-1 [&_.mention]:font-medium [&_.mention]:text-primary",
			className
		)}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onblur={() => closeDropdown()}
	></div>

	{#if dropdown.open}
		<div
			class="absolute z-50 mt-1 max-h-48 w-52 overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
			style={`top: ${dropdown.top}px; left: ${dropdown.left}px`}
			role="listbox"
			tabindex="-1"
			onmousedown={(e) => e.preventDefault()}
		>
			{#if filtered.length === 0}
				<div class="px-2 py-1.5 text-sm text-muted-foreground">No users found</div>
			{:else}
				{#each filtered as user, index}
					<button
						type="button"
						role="option"
						aria-selected={index === activeIndex}
						class={cn(
							"flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none",
							index === activeIndex ? "bg-accent text-accent-foreground" : "text-foreground"
						)}
						onmouseenter={() => (activeIndex = index)}
						onclick={() => selectUser(user)}
					>
						{#if user.avatar}
							<img src={user.avatar} alt="" class="size-5 rounded-full object-cover" />
						{:else}
							<span class="flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
								{user.name.charAt(0)}
							</span>
						{/if}
						<span class="truncate">{user.name}</span>
					</button>
				{/each}
			{/if}
		</div>
	{/if}
</div>
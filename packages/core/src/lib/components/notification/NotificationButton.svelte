<script lang="ts">
	import { cn } from '../../utils.js';

	type PermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

	interface NotificationButtonEvents {
		onClick?: () => void;
	}

	let {
		title,
		body = '',
		icon,
		class: className,
		onClick
	}: {
		title: string;
		body?: string;
		icon?: string;
		class?: string;
	} & NotificationButtonEvents = $props();

	let permission = $state<PermissionStatus>('default');
	let lastShown = $state(false);

	function showDemo() {
		// Visual demo fallback — used when permission denied or API unsupported.
		lastShown = true;
		setTimeout(() => (lastShown = false), 2500);
	}

	async function ensurePermission(): Promise<boolean> {
		if (!('Notification' in window)) {
			permission = 'unsupported';
			return false;
		}
		let current = Notification.permission as PermissionStatus;
		if (current === 'default') {
			try {
				current = await Notification.requestPermission();
			} catch {
				current = 'denied';
			}
		}
		permission = current as PermissionStatus;
		return current === 'granted';
	}

	async function handleNotify() {
		onClick?.();
		const granted = await ensurePermission();
		if (!granted) {
			showDemo();
			return;
		}
		const options: NotificationOptions = { body };
		if (icon) options.icon = icon;
		try {
			new Notification(title, options);
		} catch {
			// Some engines throw when constructed without a service worker
			if (navigator.serviceWorker?.ready) {
				const reg = await navigator.serviceWorker.ready;
				reg.showNotification(title, options);
			} else {
				showDemo();
			}
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined' && 'Notification' in window) {
			permission = Notification.permission as PermissionStatus;
		}
	});
</script>

<div class={cn('inline-flex flex-col items-start gap-1', className)} data-slot="notification-button">
	<button
		type="button"
		onclick={handleNotify}
		class="rounded-md bg-[var(--ui-primary)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
	>
		{permission === 'granted'
			? 'Notify Me'
			: permission === 'denied'
				? 'Notifications Blocked'
				: permission === 'unsupported'
					? 'Notifications Unsupported'
					: 'Enable Notifications'}
	</button>
	{#if lastShown}
		<p class="text-xs text-[var(--ui-muted-foreground)]" role="status">
			Demo: permission unavailable, notification simulated.
		</p>
	{/if}
</div>
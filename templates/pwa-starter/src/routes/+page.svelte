<script lang="ts">
	import { Menu, Home, ShoppingBag, User, Camera, Share2, Star } from 'lucide-svelte';
	import '../app.css';
	import {
		TabBar,
		TabBarItem,
		PullToRefresh,
		ListView,
		ListItem,
		ActionSheet,
		ActionSheetItem,
		FabMenu,
		SlideMenu,
		SegmentedControl,
		AvatarStack,
		MobileToast
	} from '@intinyagroup/ui';

	let activeTab = $state('home');
	let menuOpen = $state(false);
	let sheetOpen = $state(false);
	let toastOpen = $state(false);
	let toastVariant: 'default' | 'success' | 'error' | 'warning' = $state('success');
	let toastMessage = $state('');
	let filter = $state('all');

	const avatars = [
		'https://i.pravatar.cc/100?img=1',
		'https://i.pravatar.cc/100?img=2',
		'https://i.pravatar.cc/100?img=3',
		'https://i.pravatar.cc/100?img=4',
		'https://i.pravatar.cc/100?img=5',
		'https://i.pravatar.cc/100?img=6',
		'https://i.pravatar.cc/100?img=7'
	];

	function showToast(variant: 'default' | 'success' | 'error' | 'warning', message: string) {
		toastVariant = variant;
		toastMessage = message;
		toastOpen = true;
	}

	async function refresh() {
		await new Promise((r) => setTimeout(r, 1200));
	}
</script>

<svelte:head>
	<title>Intinya Mobile App</title>
</svelte:head>

<div class="mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden">
	<header
		class="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--ui-border)] px-3"
		style="padding-top: env(safe-area-inset-top)"
	>
		<button
			type="button"
			class="flex h-10 w-10 cursor-pointer touch-manipulation select-none items-center justify-center rounded-full text-[var(--ui-muted-foreground)] transition-[background-color] duration-[var(--ui-transition-fast)] active:bg-[var(--ui-accent)]"
			aria-label="Open menu"
			onclick={() => (menuOpen = true)}
		>
			<Menu class="h-5 w-5" />
		</button>
		<span class="text-lg font-semibold text-[var(--ui-foreground)]">Intinya App</span>
	</header>

	<main class="min-h-0 flex-1 overflow-y-auto">
		{#if activeTab === 'home'}
			<div class="flex flex-col gap-4 p-4">
				<SegmentedControl
					value={filter}
					options={[
						{ value: 'all', label: 'All' },
						{ value: 'active', label: 'Active' },
						{ value: 'done', label: 'Done' }
					]}
				/>

				<div class="flex items-center gap-2">
					<span class="text-xs font-medium text-[var(--ui-muted-foreground)]">Team</span>
					<AvatarStack srcs={avatars} max={4} />
				</div>

				<PullToRefresh onRefresh={refresh}>
					<ListView>
						{#each ['Feature request', 'Bug report', 'Design review', 'Refactor'] as item, i (item)}
							<ListItem
								title={item}
								description={`Order #${1000 + i}`}
								chevron
								onclick={() => showToast('default', `Opened ${item}`)}
							>
							</ListItem>
						{/each}
					</ListView>
				</PullToRefresh>

				<button
					type="button"
					class="h-12 cursor-pointer touch-manipulation select-none rounded-2xl bg-[var(--ui-primary)] font-semibold text-[var(--ui-primary-foreground)] transition active:opacity-90"
					onclick={() => (sheetOpen = true)}
				>
					Show actions
				</button>
			</div>
		{:else if activeTab === 'orders'}
			<div class="p-4">
				<ListView>
					<ListItem title="Order #1001" description="Shipped" chevron />
					<ListItem title="Order #1002" description="Processing" chevron />
					<ListItem title="Order #1003" description="Delivered" chevron />
				</ListView>
			</div>
		{:else}
			<div class="p-4">
				<p class="mb-4 text-sm text-[var(--ui-muted-foreground)]">Profile placeholder</p>
				<ListView>
					<ListItem title="Account" chevron />
					<ListItem title="Notifications" chevron />
					<ListItem title="About" chevron />
				</ListView>
			</div>
		{/if}
	</main>

	<!-- FAB speed-dial -->
	{#snippet starIcon()}
		<Star class="h-5 w-5" />
	{/snippet}
	{#snippet cameraIcon()}
		<Camera class="h-5 w-5" />
	{/snippet}
	{#snippet shareIcon()}
		<Share2 class="h-5 w-5" />
	{/snippet}
	<div class="pointer-events-none absolute inset-x-0 bottom-20 z-50 flex justify-end px-4">
		<FabMenu
			items={[
				{
					label: 'New order',
					action: () => showToast('success', 'New order created'),
					icon: starIcon
				},
				{
					label: 'Scan',
					action: () => showToast('default', 'Scanner opening'),
					icon: cameraIcon
				},
				{
					label: 'Share',
					action: () => showToast('default', 'Share link copied'),
					icon: shareIcon
				}
			]}
		/>
	</div>

	<!-- Tab bar -->
	{#snippet tabHome()}
		<Home class="h-6 w-6" />
	{/snippet}
	{#snippet tabOrders()}
		<ShoppingBag class="h-6 w-6" />
	{/snippet}
	{#snippet tabProfile()}
		<User class="h-6 w-6" />
	{/snippet}
	<TabBar value={activeTab}>
		<TabBarItem value="home" label="Home" icon={tabHome} onclick={() => (activeTab = 'home')} />
		<TabBarItem value="orders" label="Orders" icon={tabOrders} onclick={() => (activeTab = 'orders')} />
		<TabBarItem value="profile" label="Profile" icon={tabProfile} onclick={() => (activeTab = 'profile')} />
	</TabBar>

	<!-- Action sheet -->
	<ActionSheet open={sheetOpen} title="Choose an action" onclose={() => (sheetOpen = false)}>
		<ActionSheetItem
			label="Edit"
			onclick={() => {
				sheetOpen = false;
				showToast('default', 'Editing');
			}}
		/>
		<ActionSheetItem
			label="Delete"
			destructive
			onclick={() => {
				sheetOpen = false;
				showToast('error', 'Deleted');
			}}
		/>
	</ActionSheet>

	<!-- Slide menu -->
	<SlideMenu open={menuOpen} title="Menu" onclose={() => (menuOpen = false)}>
		<a
			href="/"
			class="flex h-12 items-center gap-3 px-4 text-sm text-[var(--ui-foreground)] active:bg-[var(--ui-accent)]"
			>Home</a
		>
		<a
			href="/orders"
			class="flex h-12 items-center gap-3 px-4 text-sm text-[var(--ui-foreground)] active:bg-[var(--ui-accent)]"
			>Orders</a
		>
		<a
			href="/profile"
			class="flex h-12 items-center gap-3 px-4 text-sm text-[var(--ui-foreground)] active:bg-[var(--ui-accent)]"
			>Profile</a
		>
	</SlideMenu>

	<!-- Toast -->
	<MobileToast
		open={toastOpen}
		variant={toastVariant}
		message={toastMessage}
		ondismiss={() => (toastOpen = false)}
	/>
</div>
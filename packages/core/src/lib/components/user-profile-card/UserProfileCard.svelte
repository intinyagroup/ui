<script lang="ts">
	import { cn } from '../../utils.js';

	export type ProfileStat = {
		label: string;
		value: string | number;
	};

	export type ProfileSocial = {
		icon: string;
		href: string;
		label?: string;
	};

	let {
		name,
		avatar,
		role,
		bio,
		stats = [],
		socials = [],
		cover,
		contactLabel = 'Contact',
		onContact,
		class: className
	}: {
		name: string;
		avatar?: string;
		role?: string;
		bio?: string;
		stats?: ProfileStat[];
		socials?: ProfileSocial[];
		cover?: string;
		contactLabel?: string;
		onContact?: () => void;
		class?: string;
	} = $props();
</script>

<div class={cn('overflow-hidden rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)]', className)}>
	<!-- Cover -->
	<div class="relative h-24 w-full">
		{#if cover}
			<img src={cover} alt="" class="h-full w-full object-cover" />
		{:else}
			<div class="h-full w-full bg-[var(--ui-muted)]" aria-hidden="true"></div>
		{/if}
	</div>

	<!-- Avatar + identity -->
	<div class="flex flex-col items-center px-6 pb-6 -mt-10">
		{#if avatar}
			<img
				src={avatar}
				alt={`${name} avatar`}
				class="h-20 w-20 rounded-full border-4 border-[var(--ui-card)] object-cover"
			/>
		{:else}
			<span
				class="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--ui-card)] bg-[var(--ui-primary)] text-2xl font-bold text-[var(--ui-primary-foreground)]"
				aria-hidden="true"
			>
				{name.charAt(0).toUpperCase()}
			</span>
		{/if}

		<h3 class="mt-3 text-lg font-bold text-[var(--ui-foreground)]">{name}</h3>
		{#if role}
			<p class="mt-0.5 text-sm text-[var(--ui-muted-foreground)]">{role}</p>
		{/if}
		{#if bio}
			<p class="mt-2 text-center text-sm leading-relaxed text-[var(--ui-muted-foreground)]">{bio}</p>
		{/if}

		<!-- Stats row -->
		{#if stats.length > 0}
			<div class="mt-4 grid w-full grid-cols-3 divide-x divide-[var(--ui-border)] rounded-lg border border-[var(--ui-border)] bg-[var(--ui-muted)]/50">
				{#each stats as stat (stat.label)}
					<div class="flex flex-col items-center px-2 py-2.5">
						<span class="text-base font-bold text-[var(--ui-foreground)]">{stat.value}</span>
						<span class="text-xs text-[var(--ui-muted-foreground)]">{stat.label}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Socials + contact -->
		<div class="mt-4 flex w-full items-center justify-center gap-2">
			{#each socials as social (social.href)}
				<a
					href={social.href}
					target="_blank"
					rel="noreferrer"
					aria-label={social.label ?? `Open ${name}'s social profile`}
					title={social.label}
					class="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ui-border)] text-[var(--ui-muted-foreground)] transition-colors hover:border-[var(--ui-primary)]/40 hover:text-[var(--ui-primary)]"
				>
					<span class="text-base leading-none" aria-hidden="true">{social.icon}</span>
				</a>
			{/each}
			{#if onContact}
				<button
					type="button"
					onclick={onContact}
					class="ml-1 rounded-full bg-[var(--ui-primary)] px-5 py-2 text-sm font-semibold text-[var(--ui-primary-foreground)] transition-opacity hover:opacity-90"
				>
					{contactLabel}
				</button>
			{/if}
		</div>
	</div>
</div>